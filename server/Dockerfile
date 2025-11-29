# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create directory for temp files
RUN mkdir -p /tmp

# Expose port (default 3000, can be overridden via env)
EXPOSE 3000

# Start the server
CMD ["node", "src/app.js"]

