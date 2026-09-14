# ==========================================
# Stage 1: Build Angular Application
# ==========================================
FROM node:22-alpine AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and build production bundle
COPY . .
RUN npm run build --configuration=production

# ==========================================
# Stage 2: Serve with Nginx
# ==========================================
FROM nginx:alpine AS production

# Remove default Nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled Angular browser artifacts from build stage
COPY --from=build /app/dist/front-pol-management-tools/browser /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Run Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
