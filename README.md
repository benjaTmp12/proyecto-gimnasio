# Sistema de Gestión de Gimnasio

Plataforma web desarrollada para la administración de socios, membresías, clases e inscripciones de un gimnasio.

## Funcionalidades

- Gestión de socios.
- Gestión de membresías.
- Gestión de clases.
- Inscripción de socios a clases.
- Sistema de autenticación con JWT.
- Recuperación de contraseña.
- Panel administrativo.
- Conexión a base de datos MySQL mediante Sequelize.

## Stack Tecnológico

### Backend
- Node.js
- Express.js
- Sequelize ORM
- MySQL
- JWT (JSON Web Token)
- Nodemailer

### Frontend
- Vue 3
- Vite
- JavaScript
- CSS

## Estructura del Proyecto

```text
proyecto-gimnasio/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── migrations/
│   └── config/
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── views/
│   └── assets/
```

## Instalación y Ejecución Local

### 1. Clonar el repositorio

```bash
git clone https://github.com/benjaTmp12/proyecto-gimnasio.git
```

### 2. Instalar dependencias del backend

```bash
cd backend
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env` dentro de la carpeta `backend`:

```env
DATABASE_URL=mysql://usuario:contraseña@localhost:3306/gimnasio_db
JWT_SECRET=tu_clave_secreta
```

### 4. Crear la base de datos

```sql
CREATE DATABASE gimnasio_db;
```

### 5. Ejecutar migraciones

```bash
npx sequelize-cli db:migrate
```

### 6. Iniciar el backend

```bash
npm run dev
```

### 7. Iniciar el frontend

```bash
cd ../frontend
npm install
npm run dev
```

## Variables de Entorno

### Desarrollo Local

Copiar el archivo `.env.example` y completar los datos correspondientes.

### Producción

Configurar las variables directamente en la plataforma de despliegue:

- DATABASE_URL
- JWT_SECRET

## Base de Datos

El sistema utiliza MySQL y Sequelize ORM para:

- Gestionar modelos.
- Ejecutar migraciones.
- Mantener la estructura de la base de datos.

## Autor

**Benjamín Alfonso Tampier Miguel**

Proyecto desarrollado como parte de la asignatura de Desarrollo de Aplicaciones Web.    