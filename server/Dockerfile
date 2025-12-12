# Stage 1: Dependencies (optimized for memory)
FROM node:22-alpine AS deps
WORKDIR /app

# Copy only package files for better layer caching
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production --no-audit --no-fund && \
    npm cache clean --force

# Stage 2: Production (minimal image)
FROM node:22-alpine
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application code
COPY . .

# CLEANUP: Remove unnecessary files to reduce image size
RUN rm -rf test/ coverage/ logs/ .git/ .github/ && \
    find . -name "*.md" -type f -delete && \
    find . -name "*.test.js" -type f -delete && \
    find . -name "*.spec.js" -type f -delete && \
    find . -name ".eslintrc*" -type f -delete && \
    find . -name ".prettierrc*" -type f -delete && \
    find . -name "jest.config.*" -type f -delete && \
    find . -name "*.map" -type f -delete && \
    rm -rf node_modules/.cache

# Security: Run as non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

# Optimize Node.js for production
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=200"

EXPOSE 3000

# Use node directly (no pm2 overhead for memory optimization)
CMD ["node", "src/app.js"]
