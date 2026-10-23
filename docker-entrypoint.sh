#!/bin/sh
set -e

WRITABLE_DIRS="/code/configStorage /code/tmp"

if [ "$(id -u)" = "0" ]; then
  # Volumes created by older images (running as root) are owned by root
  # hand them over to the unprivileged app user before dropping privileges
  for dir in $WRITABLE_DIRS; do
    if [ -d "$dir" ]; then
      find "$dir" \! -user node -exec chown node:node {} + \
        || echo "WARN: could not change ownership of $dir, writes may fail" >&2
    fi
  done
  exec su-exec node "$@"
fi

exec "$@"
