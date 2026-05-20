#!/bin/sh
set -e

#Fix permissions of the mounted volume dynamically at runtime
echo "Fixing permissions for /app/configStorage..."
chown -R node:node /app/configStorage
chmod -R 775 /app/configStorage

# Execute the CMD passed from the Dockerfile, but drop down to the 'node' user
exec su-exec node "$@"