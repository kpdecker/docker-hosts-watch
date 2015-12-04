FROM node:5

ENV NODE_ENV=production

RUN mkdir /data
RUN touch /data/docker-hosts
VOLUME ["/data"]

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install
COPY . /usr/src/app

CMD [ "node", "./index.js", "watch", "/data/docker-hosts" ]
