FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 5002

CMD ["sh", "-c", "if [ \"$SERVICE_TYPE\" = \"worker\" ]; then node dist/workers/postWorker.js; else node dist/workers/server.js; fi"]