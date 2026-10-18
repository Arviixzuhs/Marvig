# 1. Instalar dependencias completas
FROM node:20.19.0-alpine AS deps
WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

RUN npm ci

# 2. Generar cliente de Prisma y compilar TypeScript
FROM node:20.19.0-alpine AS build
WORKDIR /usr/src/app

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .

# Genera el código dentro de la carpeta custom (generated/prisma)
RUN npx prisma generate

# Compila la aplicación
RUN npm run build

# 3. Imagen de producción ligera
FROM node:20.19.0-alpine AS production
WORKDIR /usr/src/app

ENV NODE_ENV=production

RUN apk add --no-cache openssl libc6-compat

COPY package*.json ./

RUN npm ci --omit=dev

# Copia el código compilado, la carpeta prisma y prisma.config.ts (requerido en Prisma 7)
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/prisma ./prisma
COPY --from=build /usr/src/app/prisma.config.ts ./prisma.config.ts

EXPOSE 3000

# IMPORTANTE: Ejecuta la migración en runtime antes de iniciar la app
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]