import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Controller('api')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(password) {
        return await this.authService.register(password);
    }

    @Post('signIn')
    async signIn(@Body() userData) {
        return await this.authService.signIn(userData);
    }

    @Get('profile/:USERID')
    async getUser() {
        return await this.authService.getUser();
    }

}
