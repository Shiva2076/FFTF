# Stage 1: Builder
FROM node:18-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --legacy-peer-deps

COPY . . 

# Build arguments
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_PAYPALCLIENTID
ARG NEXT_PUBLIC_PAYPALCLIENTSECRET

# Environment variables
ENV NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL}
ENV NEXT_PUBLIC_PAYPALCLIENTID=${NEXT_PUBLIC_PAYPALCLIENTID}
ENV NEXT_PUBLIC_PAYPALCLIENTSECRET=${NEXT_PUBLIC_PAYPALCLIENTSECRET}

# Build with lint warnings allowed
RUN npm run build

# Stage 2: Runner
FROM node:18-alpine
WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# ✅ NEW: Copy the config file so 'npm start' can read it
COPY --from=builder /app/next.config.ts ./next.config.ts

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["npm", "start"]