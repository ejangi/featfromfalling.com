FROM node:22

WORKDIR /usr/src/app
VOLUME /usr/src/app
EXPOSE 3000
EXPOSE 3001

COPY package.json /usr/src/app/

RUN npm install && \
    npm install -g gulp

ENTRYPOINT ["gulp", "watch"]
