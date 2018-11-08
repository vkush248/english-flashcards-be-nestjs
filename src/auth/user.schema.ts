import { HttpException, HttpStatus } from '@nestjs/common';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import * as mongoose from 'mongoose';

type TokenType = 'access' | 'refresh';

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
    refreshToken: {
        unique: false,
        type: String,
        required: false,
        expires: 60,
    },
    hash: String,
    salt: String,
    blacklistedTokens: [],
});

userSchema.methods.setPassword = function(password: string): void {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

userSchema.methods.validPassword = function(password: string) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    if (this.password === hash) {
        return true;
    } else {
        throw new HttpException('Invalid username or password.', HttpStatus.FORBIDDEN);
    }
};

userSchema.methods.generateJwt = function(tokenType: TokenType) {
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
        exp: expiry.getTime(),
    }, 'KEEP SIGNATURE SOMEWHERE ELSE');
};
