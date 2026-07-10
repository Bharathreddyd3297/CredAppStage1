# =====================================================================
# CREDPAY Frontend - production multi-stage Dockerfile
# React 18 + Vite + Material UI  ->  static files served by Nginx
# =====================================================================

# ---------------------------------------------------------------------
# Stage 1: BUILD - compile the React app into static assets with Node
# ---------------------------------------------------------------------
FROM node:22-alpine AS build

WORKDIR /app

# Copy ONLY manifests first so the dependency-install layer is cached and
# is not rebuilt when application source changes. (package*.json always
# matches package.json, and package-lock.json when present.)
COPY package*.json ./

# Deterministic install when a lockfile is present (faster, reproducible
# for CI/CD); fall back to npm install if the lockfile is missing.
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy the rest of the source and produce the production build in dist/
COPY . .
RUN npm run build

# ---------------------------------------------------------------------
# Stage 2: RUNTIME - serve the static dist/ with Nginx (no Node here)
# ---------------------------------------------------------------------
FROM nginx:stable-alpine AS runtime

# SPA-aware Nginx config (history fallback, gzip, asset caching)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy ONLY the build output - no node_modules, src, or package.json
COPY --from=build /app/dist /usr/share/nginx/html

# Documents the port Nginx listens on (does not publish it)
EXPOSE 80

# Use the base image's default Nginx entrypoint/command:
#   nginx -g "daemon off;"  (runs Nginx in the foreground as PID 1)
