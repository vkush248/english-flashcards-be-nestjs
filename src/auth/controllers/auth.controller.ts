import { Body, Controller, Get, Param, Post, Response, Session, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from 'common/exception.filter';
import { AuthService } from '../services/auth.service';

@Controller('api')
@UseFilters(new HttpExceptionFilter())
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    register(@Body() userData) {
        this.authService.register(userData)
            .subscribe(username => username);
    }

    @Post('login')
    login(@Body() userData, @Session() session, @Response() res) {
        return this.authService.login(userData).subscribe(tokens => {
            // TRY TO IMPLEMENT THIS FUNCTION IN AUTH.SERVICE
            res.cookie('accessToken', tokens.accessToken, {
                expires: new Date(Date.now() + 60000 * 15),
                httpOnly: true,
            });
            res.cookie('refreshToken', tokens.refreshToken, {
                expires: new Date(Date.now() + 60000 * 60 * 24 * 30),
                httpOnly: true,
            });
            res.send();
        });
    }

    @Get('profile/:username')
    async getUser(@Param('username') username) {
        return await this.authService.getUserByUsername(username);
    }
}
