# 1. Dependencias de desarrollo y producción para compilación
FROM node:20.16.0-alpine AS deps
WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

# 2. Etapa de compilación
FROM node:20.16.0-alpine AS build
WORKDIR /usr/src/app

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .

# Genera el Prisma Client directamente desde las dependencias del proyecto
RUN npx prisma generate

# Compila la aplicación NestJS/TypeScript
RUN npm run build

# 3. Etapa de producción
FROM node:20.16.0-alpine AS production
WORKDIR /usr/src/app

ENV NODE_ENV=production

RUN apk add --no-cache openssl libc6-compat

COPY package*.json ./

# Instala únicamente dependencias de producción
RUN npm ci --omit=dev

# Copia los artefactos generados y la carpeta prisma
COPY --from=build /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /usr/src/app/node_modules/@prisma ./node_modules/@prisma
COPY --from=build /usr/src/app/prisma ./prisma
COPY --from=build /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]