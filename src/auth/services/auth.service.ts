import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UsersService } from './users.service';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService, private readonly usersService: UsersService) { }

    async createToken() {
        const user: JwtPayload = { username: 'test' };
        const accessToken = this.jwtService.sign(user);
        return {
            expiresIn: 3600,
            accessToken,
        };
    }

    async register(password): Promise<any> {
        return await 'register';
    }

    async signIn(): Promise<string> {
        const user: JwtPayload = { username: 'user' };
        return this.jwtService.sign(user);
    }

    async validateUser(payload: JwtPayload): Promise<any> {
        return await this.usersService.findOneByEmail(payload.username);
    }

    async getUser(): Promise<any> {
        return await 'getUser';
    }
}
