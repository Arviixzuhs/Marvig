# 1. Instalar dependencias completas
FROM node:20.19.0-alpine AS deps
WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

# 2. Generar cliente de Prisma y compilar TypeScript
FROM node:20.19.0-alpine AS build
WORKDIR /usr/src/app

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .

# Genera el código dentro de la carpeta custom (e.g. generated/prisma)
RUN npx prisma generate

# Compila la aplicación (incluyendo la carpeta generada) a dist/
RUN npm run build

# 3. Imagen de producción ligera
FROM node:20.19.0-alpine AS production
WORKDIR /usr/src/app

ENV NODE_ENV=production

# Requerido para las librerías nativas del Query Engine de Prisma en Alpine
RUN apk add --no-cache openssl libc6-compat

COPY package*.json ./

# Instala solo las dependencias de ejecución
RUN npm ci --omit=dev

# Copia el código compilado (dist) y la carpeta prisma para migraciones
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/prisma ./prisma

EXPOSE 3000

CMD ["node", "dist/src/main.js"]