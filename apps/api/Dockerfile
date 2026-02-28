# Stage 1: Base image
FROM node:20-alpine AS base
RUN npm install -g pnpm turbo
WORKDIR /app

# Stage 2: Extract only the API sub-graph
FROM base AS pruner
ARG APP_NAME=@zagotours/api
COPY . .
RUN turbo prune ${APP_NAME} --docker

# Stage 3: Install dependencies
FROM base AS installer
WORKDIR /app
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
RUN pnpm install --frozen-lockfile

# Stage 4: Build the API
FROM base AS builder
ARG APP_NAME=@zagotours/api
WORKDIR /app
COPY --from=installer /app .
COPY --from=pruner /app/out/full/ .
COPY turbo.json turbo.json

RUN pnpm turbo run generate --filter=${APP_NAME}

RUN pnpm turbo run build --filter=${APP_NAME}

# Stage 5: Final Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ARG APP_NAME=@zagotours/api

# Copy everything from builder
COPY --from=builder /app .

EXPOSE 3001

# Start the API using the turbo filter
CMD ["pnpm", "turbo", "run", "start", "--filter=@zagotours/api"]