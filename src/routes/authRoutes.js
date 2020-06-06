const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const { MY_SUPER_SECRET } = require('../secrets');

const router = express.Router();

router.post('/signup', async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(401)
            .send({ error: 'Please provide credentials' });
    }

    const user = new User({ email, password });
    try {
        await user.save();
    }
    catch (err) {
        if (err.code === 11000) {
            return res.status(409)
                .send({ error: 'User or password invalid' });
        }

        return res.status(422)
            .send({ error: 'Unkown error' });
    }

    res.status(200)
        .cookie('authCookie', generateToken(user), { httpOnly: true })
        .send({ message: 'email successfully signed up!' });
});

router.post('/signin', async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(401)
            .send({ error: 'Please provide credentials' });
    }

    const user = await User.findOne({ email });

    if (!user)
        return res.status(403).send({ error: 'User or password not valid' });

    try {
        await user.comparePassword(password);
    }
    catch (err) {
        return res.status(403).send({ error: 'User or password not valid' });
    }

    res.status(200)
        .cookie('authCookie', generateToken(user), { httpOnly: true })
        .send({ message: 'Successfully signed in!' });
});

const generateToken = (user) => {
    return jwt.sign({ userId: user._id }, MY_SUPER_SECRET);
};


module.exports = router;