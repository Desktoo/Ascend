# Stage 1: The Pruner
# Extracts exactly what is needed for the 'web' workspace
FROM node:22-slim AS pruner
WORKDIR /monorepo

# Install turbo globally
RUN npm install -g turbo

# Copy the entire monorepo
COPY . .

# Prune the workspace for the 'web' app
# This creates an 'out' folder with the exact dependencies and source files needed
RUN turbo prune web --docker

# ==============================================================================

# Stage 2: The Installer & Builder
# Installs dependencies and compiles the Next.js application
FROM node:22-slim AS builder
WORKDIR /monorepo

RUN npm install -g pnpm@12.4.2

# 1. Copy only the lockfiles and package.jsons
COPY --from=pruner /monorepo/out/json/ .


# 2. Install dependencies (this layer is cached until package.json changes)
RUN pnpm install --frozen-lockfile --ignore-scripts

# 3. Copy the actual source code
COPY --from=pruner /monorepo/out/full/ .

# 4. Declare the build arguments
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_VAPID_PUBLIC_KEY

# 5. Bind them to the environment so Next.js and Zod can read them
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_VAPID_PUBLIC_KEY=$NEXT_PUBLIC_VAPID_PUBLIC_KEY

# 6. Build the application
# We use turbo to build just the web app and its local package dependencies
RUN pnpm turbo run build --filter=web...

# ==============================================================================

# Stage 3: The Runner (Production Image)
# A secure, minimal image containing only the compiled artifacts
FROM node:22-slim AS runner
WORKDIR /monorepo

ENV NODE_ENV=production
ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

# Create a non-root user for security best practices
# this is permission group
RUN addgroup --system --gid 1001 nodejs-permission-group
# this is the non-root user
RUN adduser --system --uid 1001 non-root-user

# Set correct permissions for the nextjs user
RUN mkdir .next
RUN chown non-root-user:nodejs-permission-group .next

# Switch to the non-root user
USER non-root-user

# Copy the standalone output from the builder stage
# (This requires output: 'standalone' in next.config.js)
COPY --from=builder --chown=non-root-user:nodejs-permission-group /monorepo/apps/web/.next/standalone ./

# Copy static assets (standalone does not include these by default)
COPY --from=builder --chown=non-root-user:nodejs-permission-group /monorepo/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=non-root-user:nodejs-permission-group /monorepo/apps/web/public ./apps/web/public

EXPOSE 3001

WORKDIR /monorepo/apps/web

CMD ["node", "server.js"]
