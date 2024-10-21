# Usamos una imagen base oficial de Node.js
# FROM node:20-alpine
FROM node:20-alpine

# Establecemos el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copiamos el archivo package.json y package-lock.json al contenedor
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto de los archivos de la API
COPY . .

# Exponemos el puerto 3000
EXPOSE 3000

# Comando para iniciar la API
CMD ["npm", "start"]
