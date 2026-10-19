# STAGE 1: PRUNER
FROM node:22-slim AS pruner
WORKDIR /monorepo

RUN npm install -g turbo

COPY . .

RUN turbo prune backend --docker

# STAGE 2: BUILDER
FROM node:22-slim AS builder
WORKDIR /monorepo

RUN npm install -g pnpm@12.4.2

COPY --from=pruner /monorepo/out/json/ .

RUN pnpm install --frozen-lockfile --ignore-scripts

COPY --from=pruner /monorepo/out/full/ .

RUN pnpm --filter=@day-mark/db run db:generate

RUN pnpm turbo run build --filter=backend...

# STAGE 3: RUNNER
FROM node:22-slim AS runner
WORKDIR /monorepo

ENV NODE_ENV=production
ENV PORT=3000

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
RUN addgroup --system --gid 1001 nodejs-permission-group
RUN adduser --system --uid 1001 non-root-user
COPY --from=builder --chown=non-root-user:nodejs-permission-group /monorepo/apps/backend/dist ./apps/backend/dist

# 2. Copy the necessary package files and dependencies
COPY --from=builder --chown=non-root-user:nodejs-permission-group /monorepo/node_modules ./node_modules
COPY --from=builder --chown=non-root-user:nodejs-permission-group /monorepo/apps/backend/node_modules ./apps/backend/node_modules

# 3. (Optional) If you have a shared database package for Prisma, copy it:
COPY --from=builder --chown=non-root-user:nodejs-permission-group /monorepo/packages ./packages
EXPOSE 3000

CMD ["node", "apps/backend/dist/src/main.js"]