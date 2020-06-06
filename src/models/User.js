const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.pre('save', function (next) {
    const user = this;

    if (!user.isModified)
        return next();

    bcrypt.genSalt(10, (error, salt) => {

        if (error)
            return next(error);

        bcrypt.hash(user.password, salt, (err, hash) => {
            if (error)
                return next(error);

            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function (candidatePassword) {
    const user = this;

    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, user.password, (err, matched) => {
            if (err)
                reject(err);

            if (!matched)
                reject(false);

            resolve();
        });
    });
};

mongoose.model('User', userSchema);