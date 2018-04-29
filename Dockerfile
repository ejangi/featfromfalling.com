FROM node:9.11.1
MAINTAINER James Angus <james@ejangi.com>

WORKDIR /usr/src/app
VOLUME /usr/src/app
EXPOSE 3000
EXPOSE 3001

COPY package.json /usr/src/app/

RUN npm install && \
    npm install -g gulp

ENTRYPOINT ["gulp", "watch"]