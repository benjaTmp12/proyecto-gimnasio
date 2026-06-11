const jwt = require('jsonwebtoken');

// GEN-06: Middleware de autenticación — protege rutas con JWT
const verificarToken = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado. Se requiere un token.' });
    }

    try {
        const tokenLimpio = token.replace('Bearer ', '');

        //  Usa JWT_SECRET desde variables de entorno (GEN-02)
        const verificado = jwt.verify(tokenLimpio, process.env.JWT_SECRET);

        req.usuario = verificado;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token inválido o expirado.' });
    }
};

module.exports = { verificarToken };