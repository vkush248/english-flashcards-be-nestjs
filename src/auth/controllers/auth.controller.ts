import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Response, Session } from '@nestjs/common';
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
    login(@Body() userData, @Session() session, @Response() res) {
        // тут работает
        // throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        this.authService.login(userData, res).subscribe((tokens) => {

            if (!tokens) {
                throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
            }
            session.user = { username: userData.username };
            session.save();
            res.send();
        });
    }

    @Get('profile/:username')
    async getUser(@Param('username') username) {
        return await this.authService.getUserByUsername(username);
    }
}
