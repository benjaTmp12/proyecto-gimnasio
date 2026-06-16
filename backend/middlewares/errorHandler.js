const errorHandler = (err, req, res, next) => {
    console.error('💥 ERROR CAPTURADO:', err.message);

    const status = err.status || 500;
    const message = err.message || 'Error interno del servidor';

    const response = {
        success: false,
        error: message
    };

    if (process.env.NODE_ENV === 'development') {
        response.stack = err.stack;
    }

    res.status(status).json(response);
};

module.exports = errorHandler;