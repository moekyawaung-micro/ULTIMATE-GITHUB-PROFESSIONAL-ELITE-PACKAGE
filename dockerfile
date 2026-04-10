# Dockerfile

# ============================================
# Stage 1: Dependencies
# ============================================
FROM node:18-alpine AS dependencies

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production && \
    npm cache clean --force

# ============================================
# Stage 2: Builder
# ============================================
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build && \
    npm run test && \
    npm run lint

# ============================================
# Stage 3: Security Scanner
# ============================================
FROM aquasec/trivy:latest AS scanner

COPY --from=builder /app/dist /app

RUN trivy fs /app

# ============================================
# Stage 4: Production
# ============================================
FROM node:18-alpine

WORKDIR /app

# Security: Run as non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy production dependencies
COPY --from=dependencies --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copy built application
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Metadata
LABEL org.opencontainers.image.title="App" \
      org.opencontainers.image.description="Enterprise Application" \
      org.opencontainers.image.version="1.0.0"

# Switch to non-root user
USER nodejs

EXPOSE 3000

CMD ["node", "dist/index.js"]
