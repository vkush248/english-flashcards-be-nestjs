import { Controller, Get, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Controller('api')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(password) {
        return this.authService.register(password);
    }

    @Post('auth')
    async signIn() {
        return this.authService.signIn();
    }

    @Get('profile/:USERID')
    async getUser() {
        return this.authService.getUser();
    }

}
