FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


#Prodcution
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
# Tell Next.js to run in production

# Copy only what's needed for runtime
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm","start"]