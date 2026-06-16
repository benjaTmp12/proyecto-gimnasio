require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const errorHandler = require('./middlewares/errorHandler');
const authRoutes = require('./routes/authRoutes');
const socioRoutes = require('./routes/socioRoutes'); 
const membresiaRoutes = require('./routes/membresiaRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const claseRoutes = require('./routes/claseRoutes');
const inscripcionRoutes = require('./routes/inscripcionRoutes');
const entrenadorRoutes = require('./routes/entrenadorRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(express.json()); 

app.get('/', (req, res) => {
  res.json({ mensaje: 'API del Sistema de Gimnasio funcionando' });
});

// Rutas públicas
app.use('/api/auth', authRoutes);

// Rutas privadas de negocio (Protegidas)
app.use('/api/socios', socioRoutes); 
app.use('/api/membresias', membresiaRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/clases', claseRoutes);
app.use('/api/inscripciones', inscripcionRoutes);
app.use('/api/entrenadores', entrenadorRoutes);
app.use('/api/dashboard', dashboardRoutes);


app.use((req, res, next) => {
    res.status(404).json({ error: true, message: 'La ruta solicitada no existe en la API' });
});

app.use(errorHandler);


app.listen(PORT, async () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
  try {
    await sequelize.authenticate();
    console.log('Base de datos conectada.');
  } catch (error) {
    console.error('Error BD:', error);
  }
});
