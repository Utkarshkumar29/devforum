FROM node:18-alpine as Builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app .

ENV NODE_ENV=production

EXPOSE 5001

COPY .env .env

CMD ["node","server.js"]