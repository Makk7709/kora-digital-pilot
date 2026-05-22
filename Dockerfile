# syntax=docker/dockerfile:1.6
# ============================================================================
# Kora Digital Pilot — multi-stage container image
# ----------------------------------------------------------------------------
# Stage 1 (deps)   : install full dependency tree, including dev deps required
#                    by `vite build` and the TypeScript compiler.
# Stage 2 (build)  : produce the SPA bundle under /app/dist.
# Stage 3 (runtime): node:20-alpine running the Express proxy (server.cjs),
#                    which also serves the SPA bundle as static assets.
# ----------------------------------------------------------------------------
# Wave 3 — Agent 6 (SaaSisation light).
# ============================================================================

ARG NODE_VERSION=20
ARG ALPINE_VERSION=3.20

# --------------------------------------------------------------------------- #
# Stage 1 — dependencies                                                      #
# --------------------------------------------------------------------------- #
FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS deps
WORKDIR /app

# Husky's `prepare` script runs on install; skip it inside the container.
ENV HUSKY=0

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund --ignore-scripts

# --------------------------------------------------------------------------- #
# Stage 2 — build the SPA                                                     #
# --------------------------------------------------------------------------- #
FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS build
WORKDIR /app
ENV HUSKY=0 \
    NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Vite reads VITE_* env at build time. For images that need to embed a
# Supabase URL or anon key, pass them as `--build-arg VITE_SUPABASE_URL=...`.
ARG VITE_SUPABASE_URL=""
ARG VITE_SUPABASE_ANON_KEY=""
ARG VITE_APP_NAME="Kora Digital Pilot"
ENV VITE_SUPABASE_URL=${VITE_SUPABASE_URL} \
    VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY} \
    VITE_APP_NAME=${VITE_APP_NAME}

RUN npm run build

# --------------------------------------------------------------------------- #
# Stage 3 — runtime                                                           #
# --------------------------------------------------------------------------- #
FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    HUSKY=0 \
    PROXY_PORT=3001

# Production-only dependencies.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund --ignore-scripts

# Server code + Supabase admin twin + compiled SPA bundle.
COPY server.cjs ./server.cjs
COPY src/lib/supabase-admin.cjs ./src/lib/supabase-admin.cjs
COPY --from=build /app/dist ./dist

# Drop privileges. The node:alpine image already ships a non-root `node` user.
RUN chown -R node:node /app
USER node

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3001/api/health >/dev/null 2>&1 || exit 1

# server.cjs serves the API. The SPA is served as static files when present
# under /app/dist; configure your reverse proxy or hosting platform to fall
# through to index.html for SPA routes.
CMD ["node", "server.cjs"]
