FROM node:current-alpine
ENV APP_PATH /sei-spa

RUN mkdir -p $APP_PATH
WORKDIR $APP_PATH

COPY package.json ./

RUN apk update && \
apk add git && \
apk add --no-cache python3 py-pip && \
apk --no-cache --update add build-base && \
npm rebuild node-sass --force && \
npm install -g npm@latest


EXPOSE 3000
