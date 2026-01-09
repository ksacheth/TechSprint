FROM oven/bun:alpine

WORKDIR /app

COPY backend/package.json ./package.json
COPY backend/bun.lock ./bun.lock

RUN bun install

COPY backend/ .

EXPOSE 3001

CMD ["bun", "index.js"]
