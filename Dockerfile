# ============================================
# Stage 1: Dependencies Installation Stage
# ============================================

ARG NODE_VERSION=24.13.0-slim

FROM node:${NODE_VERSION} AS dependencies

WORKDIR /flow-desk-app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* pnpm-workspace.yaml* .npmrc* ./


# Install project dependencies with frozen lockfile for reproducible builds
RUN --mount=type=cache,target=/root/.npm \
    --mount=type=cache,target=/usr/local/share/.cache/yarn \
    --mount=type=cache,target=/root/.local/share/pnpm/store \
  if [ -f package-lock.json ]; then \
    npm ci --no-audit --no-fund; \
  elif [ -f yarn.lock ]; then \
    corepack enable yarn && yarn install --frozen-lockfile --production=false; \
  elif [ -f pnpm-lock.yaml ]; then \
    corepack enable pnpm && pnpm install --frozen-lockfile; \
  else \
    echo "No lockfile found." && exit 1; \
  fi


# ============================================
# Stage 2: Build Next.js application in standalone mode
# ============================================

FROM node:${NODE_VERSION} AS builder

# Set working directory
WORKDIR /flow-desk-app

# Declare build-time arguments
ARG NEXT_PUBLIC_BETTER_AUTH_URL
ARG NEXT_PUBLIC_TINY_MCE
ARG SKIP_ENV_VALIDATION=true

ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_BETTER_AUTH_URL}
ENV NEXT_PUBLIC_TINY_MCE=${NEXT_PUBLIC_TINY_MCE}
ENV SKIP_ENV_VALIDATION=${SKIP_ENV_VALIDATION}

COPY --from=dependencies /flow-desk-app/node_modules ./node_modules

COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV BETTER_AUTH_SECRET=build-time-placeholder-secret-0123456789abcdef
ENV BETTER_AUTH_URL=http://localhost:3000
ENV TURSO_CONNECTION_URL=libsql://placeholder.turso.io
ENV TURSO_AUTH_TOKEN=placeholder
ENV STRIPE_SECRET_KEY=sk_test_placeholder
ENV STRIPE_WEBHOOK_SECRET=whsec_placeholder
ENV UPLOADTHING_TOKEN=placeholder

RUN test -n "$NEXT_PUBLIC_BETTER_AUTH_URL" && test -n "$NEXT_PUBLIC_TINY_MCE"
RUN if [ -f package-lock.json ]; then \
    npm run build; \
  elif [ -f yarn.lock ]; then \
    corepack enable yarn && yarn build; \
  elif [ -f pnpm-lock.yaml ]; then \
    corepack enable pnpm && pnpm build; \
  else \
    echo "No lockfile found." && exit 1; \
  fi

# ============================================
# Stage 3: Run Next.js application
# ============================================

FROM node:${NODE_VERSION} AS runner

WORKDIR /flow-desk-app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder --chown=node:node /flow-desk-app/public ./public

RUN mkdir .next
RUN chown node:node .next

COPY --from=builder --chown=node:node /flow-desk-app/.next/standalone ./
COPY --from=builder --chown=node:node /flow-desk-app/.next/static ./.next/static

USER node

EXPOSE 3000

CMD ["node", "server.js"]