FROM node:22-alpine3.22 AS base
ENV TZ=Europe/Paris
WORKDIR /app

# All deps stage
FROM base AS deps
ADD package.json package-lock.json ./
RUN npm ci

# Production only deps stage
FROM base AS production-deps
ADD package.json package-lock.json ./
RUN npm ci --omit=dev

# Build stage
FROM base AS build
COPY --from=deps /app/node_modules /app/node_modules
ADD . .
RUN npm run build

# Dev stage
FROM base AS dev
ENV NODE_ENV=development
COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app
COPY .env.development.local /app/.env
CMD ["node", "./bin/server.js"]
EXPOSE 3300

# Production stage
FROM base AS prod
ENV NODE_ENV=production
COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app
COPY .env.production.local /app/.env
CMD ["node", "./bin/server.js"]
EXPOSE 3300
