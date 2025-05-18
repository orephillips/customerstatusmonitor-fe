#!/bin/sh
set -e

# Print environment for debugging
echo "Environment:"
echo "PORT=${PORT}"

# Replace the port in nginx config
if [ -n "$PORT" ]; then
  echo "Configuring nginx to listen on port $PORT..."
  sed -i.bak "s|listen 80;|listen $PORT;|g" /etc/nginx/conf.d/default.conf
  cat /etc/nginx/conf.d/default.conf
fi

# Start nginx
echo "Starting nginx..."
exec nginx -g "daemon off;"
