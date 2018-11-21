import { Body, Controller, Get, Param, Post, Request, Response, Session } from '@nestjs/common';
import { CreateUserDto } from 'auth/dto/create-user.dto';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Controller('api')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    register(@Body() userData: CreateUserDto, @Response() response, @Request() request, @Session() session): Subscription {
        return this.authService.register(userData, response).subscribe(
            () => {
                const sessData = request.session;
                session.username = userData.username;
                sessData.save();
                response.status(200).send({ username: userData.username });
            },
            (error) => {
                response.status(error.status).send({ message: error.response });
            },

        );
    }

    @Post('login')
    login(@Body() userData: CreateUserDto, @Response() response, @Request() request, @Session() session): Subscription {
        return this.authService.login(userData, response).subscribe(
            () => {
                const sessData = request.session;
                session.username = userData.username;
                sessData.save();
                response.status(200).send({ username: userData.username });
            },
            (error) => {
                response.status(error.status).send({ message: error.response });
            },

        );
    }

    @Post('log-out')
    logOut(@Response() response, @Request() request, @Session() session): Subscription {
        return this.authService.logOut(response, request, session).subscribe(
            (res) => {
                response.status(200).send(res);
            },
            (error) => {
                response.status(error.status).send(`${error.status} ${error.response}`);
            },

        );
    }

    @Get('is-logged-in')
    isLoggedIn(@Request() request, @Response() response, @Session() session): Subscription {
        return this.authService.isLoggedIn(request, response, session.username).subscribe(
            () => {
                response.status(200).send({ isLoggedIn: true, username: session.username });
            },
            (error) => {
                response.status(error.status).send(`${error.status} ${error.response}`);
            },
        );
    }

    @Get('profile/:username')
    getUser(@Param('username') username: string) {
        return this.authService.getUser(username);
    }
}
