const { Membresia } = require('./models');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

async function run() {
  try {
    const planes = [
      { tipo: 'Mensual', precio: 25000, duracionDias: 30 },
      { tipo: 'Trimestral', precio: 65000, duracionDias: 90 },
      { tipo: 'Semestral', precio: 120000, duracionDias: 180 },
      { tipo: 'Anual', precio: 220000, duracionDias: 365 }
    ];

    for (const plan of planes) {
      const [membresia, created] = await Membresia.findOrCreate({
        where: { tipo: plan.tipo },
        defaults: plan
      });

      if (!created) {
        membresia.precio = plan.precio;
        membresia.duracionDias = plan.duracionDias;
        await membresia.save();
      }
    }
    
    console.log('Planes predefinidos cargados con éxito.');
    process.exit(0);
  } catch (error) {
    console.error('Error al configurar membresías:', error);
    process.exit(1);
  }
}

run();
