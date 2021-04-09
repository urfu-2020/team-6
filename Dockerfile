FROM node:10
# Копируем всё что нужно из локальной папки в образ

COPY app /app
COPY package-lock.json /
COPY package.json /

# Устанавливаем зависимости, в образе появится /node_modules
RUN npm ci --production
# При старте контейнер начнёт общаться через 80 порт
EXPOSE 80

# При старте контейнер выполнит эту команду – запустит наше приложение
CMD node app/index.js