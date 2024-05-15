const jwt = require('jsonwebtoken')
const { jwtSecret } = require('../configs/app.config')

const generateToken = user => {
    return jwt.sign(user, jwtSecret, {expiresIn: '1h'})
}

const authTokenMiddleware = (req, res, next) => {
    const urlToken = req.query.token; // Obtener el token de la URL
    if (!urlToken) {
        return res.status(401).json({ error: 'Unauthorized', message: 'Missing token' });
    }
    
    jwt.verify(urlToken, jwtSecret, (error, credentials) => {
        if (error) {
            if (error.name === 'TokenExpiredError') {
                // El token ha expirado, redirigir a la vista de recuperación de clave
                return res.redirect('/recoveryKey');
            } else {
                return res.status(401).json({ error: 'Unauthorized', message: 'Invalid token' });
            }
        }
        
        next();
    });
};
module.exports = {
    generateToken, 
    authTokenMiddleware
}