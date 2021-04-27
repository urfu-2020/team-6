FROM node
# Копируем всё что нужно из локальной папки в образ
WORKDIR /usr/app

COPY ./ ./

RUN npm install

EXPOSE $PORT

RUN npm run build
CMD npm run start
