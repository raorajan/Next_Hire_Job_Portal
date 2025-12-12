# Stage 1: Dependencies
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Production
FROM node:22-alpine
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# CLEANUP: Remove development files
RUN rm -rf test/ coverage/ logs/ && \
    find . -name "*.md" -type f -delete && \
    find . -name "*.test.js" -type f -delete && \
    find . -name "*.spec.js" -type f -delete

# Security: Run as non-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 3000
CMD ["node", "src/app.js"]