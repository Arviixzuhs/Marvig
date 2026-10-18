FROM node:20.16.0

WORKDIR /app

COPY package*.json ./
COPY dist ./dist

RUN npm install -g serve

EXPOSE 5173

CMD ["serve", "dist", "-l", "tcp://0.0.0.0:5173", "-n", "--single"]