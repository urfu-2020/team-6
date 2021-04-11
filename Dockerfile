FROM node
# Копируем всё что нужно из локальной папки в образ

COPY public /public
COPY src /src
COPY package-lock.json /
COPY package.json /
COPY tsconfig.json /
COPY server /server

ENV PUBLIC_URL="https://projectkilogram.surge.sh/"
# Устанавливаем зависимости, в образе появится /node_modules
RUN npm ci --production
RUN npm run build

# При старте контейнер начнёт общаться через 80 порт
EXPOSE $PORT

# При старте контейнер выполнит эту команду – запустит наше приложение
CMD node server/index.js
