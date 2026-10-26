FROM node:22 AS deps

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

FROM node:22 AS build

WORKDIR /usr/src/app

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .

RUN npm install -g prisma@6.19.3
RUN prisma generate

RUN npm run build

FROM node:22 AS production

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=build /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /usr/src/app/node_modules/@prisma ./node_modules/@prisma
COPY --from=build /usr/src/app/prisma ./prisma

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/skills ./skills 

CMD ["node", "dist/main.js"]
