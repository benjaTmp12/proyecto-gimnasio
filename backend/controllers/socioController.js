const { Socio, Clase, Inscripcion, sequelize } = require('../models');

exports.obtenerSocios = async (req, res) => {
  try {
    const socios = await Socio.findAll();
    res.json(socios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener socios', error });
  }
};

exports.crearSocio = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { rut, nombre, apellido, email, fechaVencimiento, plan_nombre, plan_precio, clasesIds } = req.body;
    
    // 1. Crear el socio
    const socio = await Socio.create({ 
      rut, nombre, apellido, email, fechaVencimiento, plan_nombre, plan_precio 
    }, { transaction: t });

    // 2. Procesar inscripciones a clases si se enviaron
    if (clasesIds && Array.isArray(clasesIds) && clasesIds.length > 0) {
      const hoy = new Date().toISOString().split('T')[0];

      for (const claseId of clasesIds) {
        const clase = await Clase.findByPk(claseId, { transaction: t });
        
        if (!clase) {
          throw new Error(`La clase con ID ${claseId} no existe.`);
        }
        
        if (clase.cupos <= 0) {
          throw new Error(`La clase "${clase.nombre}" ya no tiene cupos disponibles.`);
        }

        // Crear inscripción
        await Inscripcion.create({
          socioId: socio.id,
          claseId: clase.id,
          fecha: hoy
        }, { transaction: t });

        // Decrementar cupos
        clase.cupos -= 1;
        await clase.save({ transaction: t });
      }
    }

    await t.commit();
    res.status(201).json(socio);
  } catch (error) {
    await t.rollback();
    res.status(400).json({ 
      mensaje: 'Error al crear socio y/o inscribir en clases', 
      error: error.message || error 
    });
  }
};

exports.actualizarSocio = async (req, res) => {
  try {
    const { id } = req.params;
    // AQUÍ TAMBIÉN LOS RECIBIMOS PARA PODER EDITARLOS
    const { rut, nombre, apellido, email, fechaVencimiento, plan_nombre, plan_precio } = req.body;
    const socio = await Socio.findByPk(id);
    if (socio) {
      await socio.update({ rut, nombre, apellido, email, fechaVencimiento, plan_nombre, plan_precio });
      res.json(socio);
    } else {
      res.status(404).json({ mensaje: 'Socio no encontrado' });
    }
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar socio', error });
  }
};

exports.eliminarSocio = async (req, res) => {
  try {
    const { id } = req.params;
    const socio = await Socio.findByPk(id);
    if (socio) {
      await socio.destroy();
      res.json({ mensaje: 'Socio eliminado' });
    } else {
      res.status(404).json({ mensaje: 'Socio no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar socio', error });
  }
};