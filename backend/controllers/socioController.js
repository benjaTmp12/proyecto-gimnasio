const { Socio } = require('../models');

exports.obtenerSocios = async (req, res) => {
  try {
    const socios = await Socio.findAll();
    res.json(socios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener socios', error });
  }
};

exports.crearSocio = async (req, res) => {
  try {
    // AQUÍ AHORA SÍ ESTAMOS RECIBIENDO EL PLAN Y EL PRECIO
    const { rut, nombre, apellido, email, fechaVencimiento, plan_nombre, plan_precio } = req.body;
    const socio = await Socio.create({ rut, nombre, apellido, email, fechaVencimiento, plan_nombre, plan_precio });
    res.status(201).json(socio);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear socio', error });
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