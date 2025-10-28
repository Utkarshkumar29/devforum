FROM node:18-alpine AS builder 
#Image

WORKDIR /app
#make app directory inside the container not on local

COPY package*.json ./
#copies package.json and local from local to container doing this before copying the rest of the files allows docker to cache dependencies
#why ? if code changes package.json doesn't dockeer won't reinstall dependencies making build faster

RUN npm install 
# RUN npm ci --only=production Installs dependencies in clean environment (faster, more reliable than npm install) also --only=production skips dev dependencies (like ESLint, test libraries). 
#npm ci guarantees consistency across builds and avoids accidental dependency drift.

COPY . .
#Copies all your source code into the container’s /app directory.
#At this point, the container now has all your backend code + node_modules.


FROM node:18-alpine
#Starts a fresh new container again using the same Node base image

WORKDIR /app

COPY --from=builder /app /app
#Copies everything from /app in the builder stage into the /app directory in this final image.

ENV NODE_ENV=production
#Sets an environment variable NODE_ENV to "production"

EXPOSE 5000
#Documents that the container will listen on port 5000

COPY .env .env

CMD ["node", "server.js"]
#Defines the default command to run when the container starts   

#docker build -t my-backend .
    #Builds the first (builder) image → installs deps, copies code.
    #Builds the second (runtime) image → copies final app from builder.
    #Outputs a final optimized image called my-backend


#docker run -p 5000:5000 my-backend
    #Starts a container based on my-backend.
    #Maps your machine’s port 5000 → container’s port 5000.
    #Runs node index.js.