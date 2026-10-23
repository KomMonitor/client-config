# syntax=docker/dockerfile:1

ARG NODE_IMAGE=node:26.12.1-alpine3.24@sha256:40cd011b55415bc894e45b02fdd5a5dfde056921b7d23a64c74f80497af48797

# Stage 1: install production dependencies
FROM ${NODE_IMAGE} AS deps
WORKDIR /code
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund \
    && npm cache clean --force

# Stage 2: runtime image
FROM ${NODE_IMAGE}

LABEL org.opencontainers.image.title="KomMonitor Client Config" \
      org.opencontainers.image.description="Stores and serves config files for KomMonitor clients" \
      org.opencontainers.image.source="https://github.com/kommonitor/client-config" \
      org.opencontainers.image.licenses="Apache-2.0"

# gettext provides envsubst for templating config files at container start
# tini acts as init process to forward signals and reap zombies
# su-exec drops root privileges in the entrypoint
RUN apk upgrade --no-cache \
    && apk add --no-cache gettext tini su-exec

# Defaults for non-secret settings; KEYCLOAK_CLIENT_SECRET must be provided at runtime
ENV NODE_ENV=production \
    PORT=8088 \
    KEYCLOAK_ENABLED=true \
    KEYCLOAK_REALM=kommonitor \
    KEYCLOAK_AUTH_SERVER_URL=http://keycloak:8080/ \
    KEYCLOAK_RESOURCE=kommonitor-client-config \
    KOMMONITOR_ADMIN_ROLENAME=kommonitor-creator \
    KOMMONITOR_CONFIG_ROLES_POSTFIXES=.unit-resources-creator,.client-resources-creator

WORKDIR /code

# Application code stays owned by root (read-only for the app user)
COPY --from=deps /code/node_modules ./node_modules
COPY . .
COPY --chmod=755 docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

# Only the config storage and tmp directories need to be writable
RUN mkdir -p tmp \
    && chown -R node:node configStorage tmp

# The container starts as root only so the entrypoint can fix ownership of mounted volumes
# the application itself always runs as the 'node' user

EXPOSE 8088

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD wget -q -O /dev/null "http://127.0.0.1:${PORT}/config/client-app-config" || exit 1

ENTRYPOINT ["/sbin/tini", "--", "docker-entrypoint.sh"]
CMD ["node", "index.js"]
