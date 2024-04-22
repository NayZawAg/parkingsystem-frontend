FROM node:16-alpine3.16

ENV TZ=Asia/Tokyo

RUN apk update && apk add --no-chache --repository http://dl-cdn.alpinelinux.org/alpine/v3.10/main python3~=3.7
RUN apk add make g++

WORKDIR /app
RUN rm -rf ./*
COPY package.json /app/package.json

RUN apk update && \
    npm install -g npm@8.19.2

RUN npm install

EXPOSE 3000

ENV NUXT_HOST=0.0.0.0

ENV NUXT_PORT=3000

CMD ["/bin/ash"]
