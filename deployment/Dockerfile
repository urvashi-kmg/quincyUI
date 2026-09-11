# --- Build stage ---
FROM node:20.11-alpine AS build
WORKDIR /app

# npm ci (not npm install) so the lockfile stays authoritative
# (.claude/rules/security.md, supply chain).
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# Build-time public config only. Nothing sensitive may be passed as a VITE_ arg:
# Vite inlines these into the client bundle.
ARG VITE_API_BASE_URL
ARG VITE_APP_ENV=production
ARG VITE_SENTRY_DSN
RUN npm run build

# --- Runtime stage ---
FROM nginx:1.27-alpine AS runtime
COPY deployment/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

# Run unprivileged.
RUN chown -R nginx:nginx /usr/share/nginx/html
USER nginx

EXPOSE 8080
HEALTHCHECK CMD wget -q --spider http://127.0.0.1:8080/ || exit 1
