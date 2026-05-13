# syntax=docker/dockerfile:1

FROM node:20-bookworm-slim AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS deps
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates \
  && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json* ./
RUN npm ci

FROM base AS builder
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates \
  && rm -rf /var/lib/apt/lists/*
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# חייב להיות מפתח תקף מ־Clerk (אותו NEXT_PUBLIC שבפרודקשן) — לא placeholder, אחרת next build נופל.
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

# מניעת כשלון "MONGODB_URI לא מוגדר" אם מודול טוען את lib/mongodb בזמן build (אין שרת Mongo בשלב זה).
ARG MONGODB_URI=mongodb://127.0.0.1:27017/next-docker-build
ENV MONGODB_URI=$MONGODB_URI

RUN test -n "$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" || (echo "::error NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is empty — הגדר משתנה זה בהרצת build (ראה env.docker.example / .env.prod)" && exit 1)

ENV NODE_ENV=production
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates \
  && rm -rf /var/lib/apt/lists/* \
  && addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
