const logger = require('../config/logger');

const requestLogger = (req, res, next) => {
    const start = Date.now();

    // Log when the request completes
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info('HTTP Request', {
            method: req.method,
            url: req.url,
            status: res.statusCode,
            duration: `${duration}ms`,
            userAgent: req.get('user-agent'),
            ip: req.ip
        });
    });

    next();
};

module.exports = requestLogger;
