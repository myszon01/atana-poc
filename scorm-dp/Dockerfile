# Step 1: Build Stage
FROM node:20-alpine AS builder

WORKDIR /usr/src
COPY ./*.json ./
COPY ./src/ ./

RUN npm i

RUN ls -la /tmp
RUN cat tsconfig.json


RUN npm run build

# Step 2: Run Stage

FROM node:20-alpine

COPY --from=builder /usr/src/dist ./
COPY --from=builder /usr/src/package.json ./
COPY --from=builder /usr/src/package-lock.json ./


RUN npm ci --production


CMD ["node", "server.js"]