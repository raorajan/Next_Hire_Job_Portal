FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN npm ci --only=production --no-audit --no-fund

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

USER nextjs

# Expose port
EXPOSE 3000

# Start command
CMD ["node", "src/app.js"]
# OR if using npm start: CMD ["npm", "start"]