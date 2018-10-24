import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import * as mongoose from 'mongoose';

export const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    email: {
        unique: true,
        type: String,
        required: true,
    },
    password: {
        unique: false,
        type: String,
        required: true,
    },
    cards: {
        unique: false,
        type: Array,
        required: true,
    },
    hash: String,
    salt: String,
});

userSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

userSchema.methods.validPassword = function(password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.password === hash;
};

userSchema.methods.generateJwt = function(tokenType) {
    const expiry = new Date();
    switch (tokenType) {
        case 'access':
            expiry.setMinutes(expiry.getMinutes() + 15);
            break;
        case 'refresh':
            expiry.setDate(expiry.getDate() + 30);
            break;
    }

    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        exp: expiry.getTime() / 1000,
    }, 'KEEP SIGNATURE SOMEWHERE ELSE');
};
