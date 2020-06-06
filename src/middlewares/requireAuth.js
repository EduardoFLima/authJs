const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const { MY_SUPER_SECRET } = require('../secrets');

module.exports = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization)
        return res.status(401).send({ error: 'Please provide token' });

    const token = authorization.replace('Bearer ', '');

    if (!token)
        return res.status(401).send({ error: 'Please provide token' });

    jwt.verify(token, MY_SUPER_SECRET, async (err, payload) => {
        if (err) {
            return res.status(401).send({ error: 'Token invalid' });
        }
        
        const user = await User.findById(payload.userId);

        if (!user)
            return res.status(401).send({ error: 'Token invalid' });

        console.log('the user is ', user);
        req.user = user;

        next();

    });
};