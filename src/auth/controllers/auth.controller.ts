import { Body, Controller, Get, Param, Post, Response } from '@nestjs/common';
import { CreateUserDto } from 'auth/dto/create-user.dto';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Controller('api')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    register(@Body() userData: CreateUserDto): Observable<string> {
        return this.authService.register(userData);
    }

    @Post('login')
    login(@Body() userData: CreateUserDto, @Response() response): Subscription {
        return this.authService.login(userData, response).subscribe(
            () => {
                response.status(200).send();
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
