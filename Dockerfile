FROM node
# Копируем всё что нужно из локальной папки в образ

COPY client /client
COPY server /server
COPY package.json /

# Устанавливаем зависимости, в образе появится /node_modules
RUN npm ci --production
# При старте контейнер начнёт общаться через 80 порт
EXPOSE $PORT

# При старте контейнер выполнит эту команду – запустит наше приложение
CMD node server/index.js
