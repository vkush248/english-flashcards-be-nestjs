import { Body, Controller, Get, Param, Post, Request, Response, Session, UseFilters } from '@nestjs/common';
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
    login(@Body() userData, @Session() session, @Response() res, @Request() req) {
        return this.authService.login(userData, res).subscribe(() => {
            // TRY TO IMPLEMENT THIS FUNCTION IN AUTH.SERVICE
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
