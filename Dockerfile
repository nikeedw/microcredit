FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install -g prisma

RUN prisma generate

COPY prisma/schema.prisma ./prisma/

EXPOSE 8001

# Запускаю сервер внутри контейнера
CMD ["npm", "start"]