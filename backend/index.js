require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const authRoutes = require('./routes/authRoutes');
const socioRoutes = require('./routes/socioRoutes'); // <-- NUEVO IMPORT

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); 
app.use(express.json()); 

app.get('/', (req, res) => {
  res.json({ mensaje: 'API del Sistema de Gimnasio funcionando' });
});

// Rutas públicas
app.use('/api/auth', authRoutes);

// Rutas privadas de negocio (Protegidas)
app.use('/api/socios', socioRoutes); // <-- NUEVA RUTA CONECTADA

app.listen(PORT, async () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
  try {
    await sequelize.authenticate();
    console.log('Base de datos conectada.');
  } catch (error) {
    console.error('Error BD:', error);
  }
});