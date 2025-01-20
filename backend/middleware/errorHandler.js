const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
    logger.error('Unhandled Error', {
        error: err.message,
        stack: err.stack,
        method: req.method,
        url: req.url,
        body: req.body,
        user: req.user ? req.user.id : 'anonymous'
    });

    res.status(500).json({
        message: 'An unexpected error occurred',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
};

module.exports = errorHandler;
