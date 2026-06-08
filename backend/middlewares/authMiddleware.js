const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    const token = req.header('Authorization');
    // Si no hay token, bloqueamos el acceso
    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado. Se requiere un token.' });
    }

    try {
        const tokenLimpio = token.replace('Bearer ', '');
        
        // Verificamos si el token es real y no ha expirado
        const verificado = jwt.verify(tokenLimpio, 'secreto_gimnasio_123');
        
        // Guardamos los datos del usuario en la petición para usarlos después
        req.usuario = verificado;
        next(); 
    } catch (error) {
        res.status(401).json({ error: 'Token inválido o expirado.' });
    }
};

module.exports = { verificarToken };