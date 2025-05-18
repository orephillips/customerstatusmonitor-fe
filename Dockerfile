# Build stage
FROM node:18-alpine as build-stage

WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Check Node version and install dependencies with network retries
RUN node -v && \
    yarn config set network-timeout 300000 && \
    yarn config set ignore-engines true && \
    yarn install --network-timeout 300000 --ignore-engines

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

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose port (Cloud Run will override this with PORT env variable)
EXPOSE 8080

# Use the entrypoint script
CMD ["/entrypoint.sh"]
