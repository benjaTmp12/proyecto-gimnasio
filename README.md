# Sistema de Gestión de Gimnasio

Plataforma web para la gestión de socios y membresías de un gimnasio.

## Stack Tecnológico
- Backend: Node.js, Express, Sequelize, MySQL.
- Frontend: HTML, CSS, JavaScript.

## Instalación y Ejecución Local

1. Clonar el repositorio.
2. Entrar a la carpeta del backend: `cd backend`
3. Instalar dependencias: `npm install`
4. Crear la base de datos `gimnasio_db` en MySQL.
5. Ejecutar migraciones: `npx sequelize-cli db:migrate`
6. Levantar el servidor: `npm run dev`

## Variables de Entorno (Local vs Producción)
El proyecto requiere configurar variables de entorno para funcionar.

- **Entorno Local:** Debes copiar el archivo `backend/.env.example`, renombrarlo a `backend/.env` y colocar ahí tus credenciales reales de MySQL en la variable `DATABASE_URL`. Este archivo `.env` está ignorado en Git por seguridad.
- **Producción (Hosting):** Al subir este proyecto a internet (ej. Railway), no se sube ningún archivo `.env`. Las variables `DATABASE_URL` y `JWT_SECRET` se deben configurar manualmente en el panel de control de la plataforma de hosting.