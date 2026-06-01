require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models'); // Importa la configuración de Sequelize

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Permite peticiones desde el frontend
app.use(express.json()); // Permite recibir datos en formato JSON

// Ruta de prueba básica
app.get('/', (req, res) => {
  res.json({ mensaje: 'API del Sistema de Gimnasio funcionando correctamente' });
});

// Levantar el servidor y probar la conexión a la Base de Datos
app.listen(PORT, async () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  try {
    // Autenticar conexión con la base de datos
    await sequelize.authenticate();
    console.log('Conexión a la base de datos MySQL establecida correctamente.');
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
  }
});