# Stage 1: Build (optimized for memory)
FROM node:22-alpine AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including devDependencies for build)
RUN npm ci --no-audit --no-fund && \
    npm cache clean --force

# Copy source code
COPY . .

# CLEANUP: Remove unnecessary files before build
RUN find . -name "*.md" -type f -delete && \
    find . -name "*.test.js" -type f -delete && \
    find . -name "*.spec.js" -type f -delete && \
    find . -name ".eslintrc*" -type f -delete && \
    find . -name ".prettierrc*" -type f -delete && \
    rm -rf .git/ .github/ node_modules/.cache

# Build with memory optimization
ENV NODE_OPTIONS="--max-old-space-size=512"
RUN npm run build

# Stage 2: Production (minimal nginx)
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx-custom.conf /etc/nginx/conf.d/default.conf

# Remove unnecessary files and optimize
RUN rm -rf /usr/share/nginx/html/*.map && \
    rm -f /etc/nginx/conf.d/default.conf.bak

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
