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
        const user = new this.userModel(userData);
        return await user;
    }

    async signIn(userData): Promise<string> {
        return await this.jwtService.sign(userData);
    }

    async validateUser(payload: JwtPayload): Promise<any> {
        return await this.usersService.findOneByEmail(payload.username);
    }

    async getUser(): Promise<any> {
        return await 'getUser';
    }
}
