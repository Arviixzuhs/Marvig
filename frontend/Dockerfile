# 1. Etapa de compilación (Build)
FROM node:22-slim AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Compila el código de React + Vite dentro del contenedor (genera /app/dist)
RUN npm run build

# 2. Etapa de producción (Servidor con Node)
FROM node:22-slim AS production

WORKDIR /app

# Instala la herramienta liviana 'serve'
RUN npm install -g serve

# Copia ÚNICAMENTE la carpeta dist compilada en la etapa anterior
COPY --from=build /app/dist ./dist

EXPOSE 5173

# Sirve la SPA en el puerto 5173 permitiendo el enrutamiento del lado del cliente (-s)
CMD ["serve", "-s", "dist", "-l", "5173"]