FROM node:lts-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY src ./src
COPY views ./views
COPY app.js ./

CMD ["node", "./app.js"]