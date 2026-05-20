FROM node:20-alpine

LABEL maintainer="KomMonitor"
LABEL description="KomMonitor Client Config API"

# Install dependencies
RUN apk add --no-cache dumb-init su-exec

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Create directory and chown to the 'node' user (UID 1000)
RUN mkdir -p /app/configStorage/dashboards && \
    chown -R node:node /app && \
    chmod -R 755 /app && \
    chmod -R 775 /app/configStorage /app/configStorage/dashboards && \
    ln -s /app /code

EXPOSE 8088

# Use dumb-init and our wrapper script
ENTRYPOINT ["dumb-init", "--", "/app/entrypoint.sh"]

# Start application (passed to entrypoint.sh as "$@")
CMD ["npm", "start"]