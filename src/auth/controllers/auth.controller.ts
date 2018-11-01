import { Body, Controller, Get, Param, Post, Response } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Controller('api')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    register(@Body() userData) {
        return this.authService.register(userData);
    }

    @Post('login')
    login(@Body() userData, @Response() res) {
        return this.authService.login(userData, res).subscribe(
            () => res.status(200).send(),
            (error) => {
                res.status(error.status).send(`${error.status} ${error.response}`);
            },

        );
    }

    @Get('profile/:username')
    getUser(@Param('username') username) {
        return this.authService.getUser(username);
    }
}
