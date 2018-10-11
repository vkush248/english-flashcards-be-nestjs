import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'auth/interfaces/user.interface';
import { Model } from 'mongoose';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UsersService } from './users.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService,
    ) { }

    async createToken() {
        const user: JwtPayload = { username: 'test' };
        const accessToken = this.jwtService.sign(user);
        return {
            expiresIn: 3600,
            accessToken,
        };
    }

    async register(userData): Promise<any> {
        const hashedUser = { ...userData, ...await this.usersService.setPassword(userData.password) };
        const user: any = new this.userModel(hashedUser);
        return await user.save();
    }

    async signIn(userData): Promise<boolean> {
        const userInDb = await this.getUser(userData);
        const user: any = new this.userModel(userInDb);
        return await user.validPassword(userData.password);
    }

    async getUser(userData): Promise<any> {
        return await this.userModel.findOne({ username: userData.username });
    }
}
