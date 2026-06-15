const { Socio, Clase } = require('../models'); // Importamos tus modelos reales

exports.getResumenDashboard = async (req, res) => {
  try {
    // 1. Consultas reales a tu base de datos
    const totalSocios = await Socio.count();
    const sociosRecientes = await Socio.findAll({ 
      limit: 5, 
      order: [['createdAt', 'DESC']] 
    });
    const clasesHoy = await Clase.findAll({ limit: 3 });

    // 2. Armamos el paquete exacto que espera el Vue
    const kpis = {
      totalSocios: totalSocios,
      sociosActivos: totalSocios, // Si tienes una columna de estado, aquí pondrías ese count
      membresiasVencidas: 3, 
      clasesHoy: clasesHoy.length,
      cuposDisponibles: 45,
      ingresosMes: 850000
    };

    const alertas = [
      { tipo: 'success', mensaje: 'Conectado correctamente a la BD en Railway 🚂' }
    ];

    // Formateamos las clases para la tabla
    const clases = clasesHoy.map(c => ({
      id: c.id,
      nombre: c.nombre || 'Clase',
      instructor: c.instructor || 'Staff',
      horario: c.horario || 'Por definir',
      inscritos: c.inscritos || 0, 
      cuposTotales: c.cupos || 20
    }));

    // Formateamos los socios para la tabla
    const ultimosSocios = sociosRecientes.map(s => ({
      id: s.id,
      nombre: s.nombre,
      apellido: s.apellido,
      estado: s.estado || 'Activo',
      vencimiento: s.vencimiento || 'Sin fecha'
    }));

    // 3. Enviamos todo al Frontend
    res.json({ kpis, alertas, clases, ultimosSocios });

  } catch (error) {
    console.error("Error en Dashboard:", error);
    res.status(500).json({ error: true, message: 'Error interno al cargar dashboard' });
  }
};