# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Copy package files and install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev

# Stage 2: Runner
FROM node:20-alpine AS runner
WORKDIR /app

# Set Node environment to production
ENV NODE_ENV=production

# Copy production node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
# Copy application source code
COPY package*.json ./
COPY src ./src

# Use built-in non-root node user for security
USER node

# Expose port
EXPOSE 5000

# Health check using Node built-in fetch API
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://localhost:5000/api/health').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

# Start Express server
CMD ["node", "src/server.js"]
