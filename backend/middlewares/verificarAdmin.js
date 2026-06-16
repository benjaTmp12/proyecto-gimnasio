const jwt = require('jsonwebtoken');

const verificarAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ success: false, error: 'Token no proporcionado' });

    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        if (payload.rol !== 'admin') {
            return res.status(403).json({ success: false, error: 'Acceso denegado. Se requieren permisos de administrador.' });
        }
        req.usuario = payload;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, error: 'Token inválido' });
    }
};

module.exports = verificarAdmin;
