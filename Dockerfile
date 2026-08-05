# syntax=docker/dockerfile:1

# Debian rather than Alpine on purpose: Prisma's schema engine and Tailwind v4's
# native lightningcss/oxide binaries are both better behaved on glibc, and the
# musl size win isn't worth the debugging.
ARG NODE_VERSION=24-bookworm-slim
ARG PNPM_VERSION=11.17.0


# ---- base -------------------------------------------------------------------
FROM node:${NODE_VERSION} AS base
ARG PNPM_VERSION
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
# openssl is required by the Prisma CLI's schema engine
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate
WORKDIR /app


# ---- deps -------------------------------------------------------------------
# pnpm-workspace.yaml carries onlyBuiltDependencies; without it @prisma/engines
# never runs its postinstall and `prisma generate` fails downstream.
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile


# ---- builder ----------------------------------------------------------------
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# prisma/generated is gitignored and there is no postinstall hook, so every
# `@/prisma/generated/client` import fails until this runs. prisma.config.ts
# points `schema` at the prisma/ directory, not a single file.
RUN pnpm exec prisma generate

# next build needs network access: app/layout.tsx pulls Geist via
# next/font/google from fonts.googleapis.com at build time.
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm run build


# ---- migrator ---------------------------------------------------------------
# Keeps full node_modules so the Prisma CLI is available. Run as a one-shot
# service before the app starts; keeping it out of the runtime image avoids
# multiple replicas racing on the same migration.
FROM base AS migrator
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml prisma.config.ts ./
COPY prisma ./prisma
USER node
CMD ["pnpm", "exec", "prisma", "migrate", "deploy"]


# ---- runner -----------------------------------------------------------------
FROM node:${NODE_VERSION} AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
# The standalone server binds loopback unless HOSTNAME is set, which makes it
# unreachable from outside the container.
ENV HOSTNAME=0.0.0.0

COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

# ISR / image optimization cache
RUN mkdir -p .next/cache && chown -R node:node .next

USER node
EXPOSE 3000
CMD ["node", "server.js"]
