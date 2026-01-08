FROM oven/bun:alpine

WORKDIR /app

COPY frontend/bun.lock ./bun.lock
COPY frontend/package.json ./package.json

RUN bun install 

COPY frontend/ .

ARG NEXT_PUBLIC_BACKEND_URL
ARG NEXT_PUBLIC_MAPS_API

ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}
ENV NEXT_PUBLIC_MAPS_API=${NEXT_PUBLIC_MAPS_API}

RUN bun run build

EXPOSE 3000

CMD ["bun", "run", "start"]
