import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from 'auth/dto/create-user.dto';
import { User } from 'auth/interfaces/user.interface';
import { Model } from 'mongoose';
import { from, Observable, of } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { UsersService } from './users.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
        private readonly usersService: UsersService,
    ) { }

    register(userData: CreateUserDto): Observable<any> {
        return from(this.usersService.doesUserExist(userData.username)).pipe(
            tap((doesUserExist: boolean) => {
                if (doesUserExist) {
                    throw new HttpException('Username has been taken', HttpStatus.FORBIDDEN);
                }
            }),
            filter((doesUserExist: boolean) => !doesUserExist),
            switchMap(() => of(this.usersService.setPassword(userData.password))
                .pipe(
                    map((password: { password: string, salt: string }) => new this.userModel({ ...userData, ...password })),
                    // tslint:disable-next-line:no-shadowed-variable
                    switchMap((user: User) => from(user.save())
                        .pipe(
                            // tslint:disable-next-line:no-shadowed-variable
                            map((user: User) => ({ username: user.username })),
                        ),
                    ),
                ),
            ),
        );
    }

    login(userData: CreateUserDto, response): Observable<User> {
        return this.usersService.getUserByUsername(userData.username).pipe(
            filter((user: User) => user !== null),
            map((user: any) => user.validPassword(userData.password)),
            filter((isValid: boolean) => isValid),
            switchMap(() => this.usersService.saveTokens(response, userData.username)),
        );
    }

    getUser(username: string): Observable<User> {
        return this.usersService.getUserByUsername(username);
    }

    isLoggedIn(request, response) {
        return this.usersService.isLoggedIn(request, response);
    }
}
