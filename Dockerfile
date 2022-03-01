FROM node:14-alpine as build
COPY ./package*.json ./
RUN npm ci
COPY . .
RUN npm run build


FROM node:14-alpine
RUN apk update && apk add curl
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --production
COPY --from=build ./dist ./dist

EXPOSE 3000

CMD npm run start
