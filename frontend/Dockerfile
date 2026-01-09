FROM oven/bun:alpine AS deps
WORKDIR /app
COPY frontend/bun.lock ./bun.lock
COPY frontend/package.json ./package.json
RUN bun install --frozen-lockfile

FROM oven/bun:alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY frontend/ .
ARG NEXT_PUBLIC_BACKEND_URL
ARG NEXT_PUBLIC_MAPS_API
ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}
ENV NEXT_PUBLIC_MAPS_API=${NEXT_PUBLIC_MAPS_API}
RUN bun run build

FROM oven/bun:alpine AS prod-deps
WORKDIR /app
COPY frontend/bun.lock ./bun.lock
COPY frontend/package.json ./package.json
RUN bun install --frozen-lockfile --production

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/postcss.config.mjs ./postcss.config.mjs
COPY --from=builder /app/jsconfig.json ./jsconfig.json
COPY --from=builder /app/package.json ./package.json
COPY --from=prod-deps /app/node_modules ./node_modules
USER node
EXPOSE 3000
CMD ["node", "node_modules/next/dist/bin/next", "start", "-H", "0.0.0.0", "-p", "3000"]
