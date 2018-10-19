import { Body, Controller, Get, Param, Post, Session } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Controller('api')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    register(@Body() userData) {
        this.authService.register(userData)
            .subscribe(username => username);
    }

    @Post('login')
    login(@Body() userData, @Session() session) {

        return this.authService.login(userData).subscribe((result: any) => {
            if (result.isValid) {
                session.user = userData.userName;
            }
            return result;
        });
    }

    @Get('profile/:USERID')
    async getUser(@Param('USERID') userId) {
        return await this.authService.getUserByUsername(userId);
    }
}
