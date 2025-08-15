FROM oven/bun:1.1.34-alpine AS base

WORKDIR /app

FROM base AS deps
RUN apk add --no-cache python3 make g++ 
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
RUN echo "Finished bun install --frozen-lockfile"

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

FROM oven/bun:1.1.34-alpine AS runtime
WORKDIR /app

COPY --from=build /app/dist ./dist
COPY package.json ./

RUN bun install --production --frozen-lockfile

EXPOSE 4321
ENV HOST=0.0.0.0
ENV PORT=4321

CMD ["bun", "run", "preview"]
