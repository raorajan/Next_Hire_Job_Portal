#!/bin/bash
# deploy.sh - NextHire Production Deployment with SSL

set -e  # Exit on error

echo "🚀 NextHire Production Deployment"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# ==================== SSL SETUP ====================
setup_ssl() {
    print_info "Setting up SSL certificates..."
    
    # Create ssl directory
    mkdir -p ssl
    
    # Check if certificates already exist
    if [[ -f "ssl/fullchain.pem" && -f "ssl/privkey.pem" ]]; then
        print_info "SSL certificates already exist. Skipping generation."
        return 0
    fi
    
    print_info "Generating self-signed SSL certificates (valid for 365 days)..."
    
    # Generate self-signed certificate (for development/testing)
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout ssl/privkey.pem \
        -out ssl/fullchain.pem \
        -subj "/C=IN/ST=State/L=City/O=NextHire/CN=nexthire.raorajan.pro" \
        2>/dev/null
    
    if [[ $? -eq 0 ]]; then
        print_info "SSL certificates generated successfully!"
        chmod 600 ssl/*.pem
    else
        print_error "Failed to generate SSL certificates"
        print_warn "You can manually add certificates to ssl/ directory"
        print_warn "For production, use: sudo certbot certonly --standalone -d nexthire.raorajan.pro -d nexthireapi.raorajan.pro"
    fi
}

# ==================== NGINX CONFIG ====================
setup_nginx() {
    print_info "Setting up Nginx configuration..."
    
    cat > nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    # Frontend: https://nexthire.raorajan.pro
    server {
        listen 443 ssl;
        server_name nexthire.raorajan.pro www.nexthire.raorajan.pro;
        
        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;
        
        location / {
            proxy_pass http://frontend:80;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
        
        location /api/ {
            proxy_pass http://backend:3000;
            proxy_set_header Host $host;
        }
    }

    # Backend API: https://nexthireapi.raorajan.pro
    server {
        listen 443 ssl;
        server_name nexthireapi.raorajan.pro;
        
        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;
        
        location / {
            proxy_pass http://backend:3000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            add_header 'Access-Control-Allow-Origin' 'https://nexthire.raorajan.pro' always;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
            add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization' always;
        }
    }

    # HTTP → HTTPS redirect
    server {
        listen 80;
        server_name nexthire.raorajan.pro www.nexthire.raorajan.pro nexthireapi.raorajan.pro;
        return 301 https://$server_name$request_uri;
    }
}
EOF
    
    # Create nginx config for frontend SPA
    cat > client/nginx-custom.conf << 'EOF'
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF
}

# ==================== DOCKER-COMPOSE SETUP ====================
setup_compose() {
    print_info "Updating docker-compose.yml with memory limits..."
    
    # Check if already updated
    if grep -q "memory: 256M" docker-compose.yml 2>/dev/null; then
        print_info "docker-compose.yml already has memory limits."
        return 0
    fi
    
    cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    container_name: nexthire-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - backend
      - frontend
    restart: unless-stopped
    networks:
      - nexthire-network
    deploy:
      resources:
        limits:
          memory: 50M

  backend:
    build: ./server
    container_name: nexthire-backend
    expose:
      - "3000"
    environment:
      - NODE_ENV=${NODE_ENV:-production}
      - PORT=${PORT:-3000}
      - MONGODB_URL=${MONGODB_URL}
      - JWT_SECRET=${JWT_SECRET}
      - JWT_EXPIRE=${JWT_EXPIRE}
      - BACKEND_URL=${BACKEND_URL}
      - FRONTEND_URL=${FRONTEND_URL}
      - CLOUDINARY_NAME=${CLOUDINARY_NAME}
      - CLOUDINARY_API_KEY=${CLOUDINARY_API_KEY}
      - CLOUDINARY_SECRET_KEY=${CLOUDINARY_SECRET_KEY}
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
    restart: unless-stopped
    networks:
      - nexthire-network
    deploy:
      resources:
        limits:
          memory: 256M
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000', (r) => process.exit(r.statusCode ? 0 : 1))"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build: ./client
    container_name: nexthire-frontend
    expose:
      - "80"
    environment:
      - VITE_API_URL=${VITE_API_URL}
      - VITE_FRONTEND_URL=${VITE_FRONTEND_URL}
      - VITE_CLIENT_URL=${VITE_CLIENT_URL}
      - VITE_FIREBASE_API_KEY=${VITE_FIREBASE_API_KEY}
      - VITE_FIREBASE_AUTH_DOMAIN=${VITE_FIREBASE_AUTH_DOMAIN}
      - VITE_FIREBASE_PROJECT_ID=${VITE_FIREBASE_PROJECT_ID}
      - VITE_FIREBASE_STORAGE_BUCKET=${VITE_FIREBASE_STORAGE_BUCKET}
      - VITE_FIREBASE_MESSAGING_SENDER_ID=${VITE_FIREBASE_MESSAGING_SENDER_ID}
      - VITE_FIREBASE_APP_ID=${VITE_FIREBASE_APP_ID}
      - VITE_FIREBASE_MEASUREMENT_ID=${VITE_FIREBASE_MEASUREMENT_ID}
    restart: unless-stopped
    networks:
      - nexthire-network
    deploy:
      resources:
        limits:
          memory: 64M

networks:
  nexthire-network:
    driver: bridge
EOF
}

# ==================== DOCKER IGNORE ====================
setup_dockerignore() {
    print_info "Creating .dockerignore files..."
    
    cat > server/.dockerignore << 'EOF'
node_modules
npm-debug.log
.git
.env*
*.md
Dockerfile
docker-compose*
test/
coverage/
logs/
EOF
    
    cat > client/.dockerignore << 'EOF'
node_modules
dist
npm-debug.log
.git
.env*
*.md
Dockerfile
docker-compose*
src/
public/
!public/index.html
EOF
}

# ==================== DEPLOYMENT ====================
deploy() {
    print_info "Starting deployment..."
    
    # 1. Stop and clean old containers
    print_info "Cleaning up old containers..."
    docker-compose down -v 2>/dev/null || true
    
    # 2. Build images
    print_info "Building Docker images..."
    docker-compose build --no-cache
    
    # 3. Start services
    print_info "Starting services..."
    docker-compose up -d
    
    # 4. Wait for services to be ready
    print_info "Waiting for services to start (30 seconds)..."
    sleep 30
}

# ==================== VERIFICATION ====================
verify() {
    print_info "Verifying deployment..."
    
    echo ""
    echo "📊 Service Status:"
    docker-compose ps
    
    echo ""
    echo "🧠 Memory Usage:"
    docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}" | grep nexthire
    
    echo ""
    echo "🐳 Image Sizes:"
    docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}" | grep -E "(nexthire|nginx|node)" | head -5
    
    echo ""
    echo "🌐 Your Domains:"
    echo "   Frontend: https://nexthire.raorajan.pro"
    echo "   Backend API: https://nexthireapi.raorajan.pro"
    
    echo ""
    echo "🔧 Health Checks:"
    
    # Check if containers are running
    if docker-compose ps | grep -q "Up"; then
        print_info "All services are running!"
    else
        print_error "Some services failed to start. Check logs: docker-compose logs"
    fi
}

# ==================== MAIN ====================
main() {
    echo "========================================"
    echo "NextHire Automated Deployment"
    echo "========================================"
    
    # Check if .env exists
    if [[ ! -f ".env" ]]; then
        print_error ".env file not found!"
        print_warn "Create .env file with your credentials first."
        exit 1
    fi
    
    # Load environment variables
    set -a
    source .env
    set +a
    
    # Run setup steps
    setup_ssl
    setup_nginx
    setup_compose
    setup_dockerignore
    
    # Deploy
    deploy
    
    # Verify
    verify
    
    echo ""
    print_info "✅ Deployment complete!"
    echo ""
    print_warn "Important: Ensure your DNS points to this server:"
    echo "   A record: nexthire.raorajan.pro → $(curl -s ifconfig.me)"
    echo "   A record: nexthireapi.raorajan.pro → $(curl -s ifconfig.me)"
    echo ""
    print_info "View logs: docker-compose logs -f"
    print_info "Stop services: docker-compose down"
    print_info "Update & redeploy: ./deploy.sh"
}

# ==================== RUN ====================
if [[ "$1" == "--help" || "$1" == "-h" ]]; then
    echo "Usage: ./deploy.sh [OPTION]"
    echo ""
    echo "Options:"
    echo "  --help, -h     Show this help"
    echo "  --ssl-only     Generate SSL certificates only"
    echo "  --config-only  Generate config files only"
    echo "  --deploy-only  Deploy only (skip setup)"
    echo ""
    exit 0
elif [[ "$1" == "--ssl-only" ]]; then
    setup_ssl
    exit 0
elif [[ "$1" == "--config-only" ]]; then
    setup_nginx
    setup_compose
    setup_dockerignore
    print_info "Configuration files generated!"
    exit 0
elif [[ "$1" == "--deploy-only" ]]; then
    deploy
    verify
    exit 0
else
    main
fi