FROM node:9.11.2-jessie

WORKDIR /home/node/app
USER node

ENV NODE_ENV=test

COPY . /home/node/app

ENTRYPOINT /home/node/app/entrypoint.sh
