FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production --no-audit --no-fund && npm cache clean --force
COPY . .
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=256"
EXPOSE 3000
CMD ["node", "src/app.js"]
