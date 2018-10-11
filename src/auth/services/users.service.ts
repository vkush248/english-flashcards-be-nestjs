import { Injectable } from '@nestjs/common';
import { userSchema } from 'auth/user.schema';

@Injectable()
export class UsersService {
    async findOneByUsername(username) { }

    setPassword(password) {
        userSchema.methods.setPassword(password);
        return { password: userSchema.methods.hash, salt: userSchema.methods.salt };
    }

    validPassword(password) {
        return userSchema.methods.validPassword(password);
    }
}
