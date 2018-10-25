import { Body, Controller, Get, Param, Post, Response, Session } from '@nestjs/common';
import { filter, switchMap, tap } from 'rxjs/operators';
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
    async login(@Body() userData, @Session() session, @Response() res) {
        return this.authService.login(userData).pipe(
            filter((isValid: boolean) => isValid),
            switchMap(() => this.authService.getJwt(userData.username)),
            tap((tokens: any) => {
                session.cookie.user = {
                    username: userData.username,
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                };
            }),
        ).subscribe(tokens => {
            res.cookie('accessToken', tokens.accessToken, {
                expires: new Date(Date.now() + 60000 * 15),
                httpOnly: true,
            });
            res.cookie('refreshToken', tokens.refreshToken, {
                expires: new Date(Date.now() + 60000 * 60 * 24 * 30),
                httpOnly: true,
            });
            res.send();
        },
            (err) => {
                console.log(err);

            },
        );
    }

    @Get('profile/:username')
    async getUser(@Param('username') username, @Session() session, @Response() res) {
        // return username;
        console.log('session', session);
        console.log('res', res);
        return await this.authService.getUserByUsername(username);
    }
}
