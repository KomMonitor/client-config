FROM node:20-alpine

LABEL maintainer="KomMonitor"
LABEL description="KomMonitor Client Config API"

# Install dependencies
RUN apk add --no-cache dumb-init

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Set proper permissions
RUN chown -R nodejs:nodejs /app && \
    chmod -R 755 /app && \
    chmod -R 775 /app/configStorage

# Ensure configStorage/dashboards directory exists with proper permissions
RUN mkdir -p /app/configStorage/dashboards && \
    chown -R nodejs:nodejs /app/configStorage/dashboards && \
    chmod -R 775 /app/configStorage/dashboards

# Create symlink for backward compatibility
RUN ln -s /app /code

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 8088

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8088', (r) => {if (r.statusCode !== 404) throw new Error(r.statusCode)})"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start application
CMD ["npm", "start"]
