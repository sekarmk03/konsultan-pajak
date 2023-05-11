const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = process.env;

module.exports = (roles = []) => {
    if (typeof roles === 'number') roles = [roles];

    return (req, res, next) => {
        const token = req.headers['authorization'];
        if(!token) {
            return res.status(401).json({
                status: 'UNAUTHORIZED',
                message: `You're not authorized!`,
                data: null
            });
        }

        const payload = jwt.verify(token, JWT_SECRET_KEY);
        req.user = payload;

        if (roles.length > 0 && !roles.includes(payload.role_id)) {
            return res.status(401).json({
                status: 'UNAUTHORIZED',
                message: `You're not authorized!`,
                data: null
            });
        }

        next();
    }
}