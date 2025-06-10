const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const HttpError = require('../models/errorModel')


const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.Authorization || req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new HttpError('Not authenticated', 401));
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
            return next(new HttpError('User not found', 404));
        }
        next();
    } catch (err) {
        return next(new HttpError(err, 401));
    }
}



module.exports = authMiddleware