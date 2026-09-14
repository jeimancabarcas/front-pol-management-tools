# ==========================================
# Stage 1: Build Angular Application
# ==========================================
FROM node:26-alpine AS build

WORKDIR /app

# Build arguments (optional for Coolify build-time environment variables)
ARG API_URL
ENV API_URL=$API_URL

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Inject API_URL into production environment if provided in Coolify
RUN if [ -n "$API_URL" ]; then \
      echo "Configuring custom API_URL: $API_URL"; \
      sed -i "s|apiUrl: '.*'|apiUrl: '$API_URL'|g" src/environments/environment.ts; \
    fi

# Build production bundle
RUN npm run build --configuration=production

# ==========================================
# Stage 2: Serve with Nginx (Coolify Proxy Target)
# ==========================================
FROM nginx:alpine AS production

# Remove default Nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled Angular browser artifacts from build stage
COPY --from=build /app/dist/front-pol-management-tools/browser /usr/share/nginx/html

# Expose HTTP port 80 for Coolify / Traefik
EXPOSE 80

# Run Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
