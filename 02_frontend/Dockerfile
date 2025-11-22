FROM node:20-alpine AS builder
ARG API_HOST=http://localhost:3001
WORKDIR /app
COPY package*.json ./
RUN npm install && npm cache clean --force
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1 API_HOST=${API_HOST}
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]