# Build stage
FROM node:16-alpine as build-stage

WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy all files
COPY . .

# Build the app
RUN yarn build

# Production stage
FROM nginx:stable-alpine as production-stage

# Copy built files from build stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy custom nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create a script to dynamically update nginx configuration based on PORT env variable
RUN echo '#!/bin/sh \
\
# Dynamically replace the port in the nginx config \
if [ -n "$PORT" ]; then \
  sed -i "s/listen 80/listen $PORT/g" /etc/nginx/conf.d/default.conf; \
fi \
\
# Start nginx \
exec nginx -g "daemon off;"' > /docker-entrypoint.sh \
    && chmod +x /docker-entrypoint.sh

# Expose port (Cloud Run will override this with PORT env variable)
EXPOSE 80

CMD ["/docker-entrypoint.sh"]
