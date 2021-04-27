FROM node
# Копируем всё что нужно из локальной папки в образ
WORKDIR /usr/app

COPY client /client
COPY server /server
COPY package.json /
COPY package-lock.json /

RUN npm ci --production

EXPOSE $PORT

RUN npm run build
CMD npm run start
