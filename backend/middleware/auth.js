const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            logger.warn('Authentication failed: No token provided');
            return res.status(401).json({ message: 'Authentication required' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            logger.warn(`Token verification failed: ${error.message}`);
            res.status(401).json({ message: 'Invalid token' });
        }
    } catch (error) {
        logger.error(`Authentication error: ${error.message}`);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = auth;
