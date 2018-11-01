import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'auth/interfaces/user.interface';
import { Model } from 'mongoose';
import { from, Observable, of } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UsersService } from './users.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
        private readonly usersService: UsersService,
    ) { }

    register(userData: JwtPayload): Observable<any> {
        return this.usersService.doesUserExist(userData.username).pipe(
            tap(doesUserExist => {
                if (doesUserExist) {
                    throw new HttpException('Username has been taken', HttpStatus.FORBIDDEN);
                }
            }),
            filter(doesUserExist => !doesUserExist),
            switchMap(() => of(this.usersService.setPassword(userData.password))
                .pipe(
                    map(user => ({ ...userData, ...user })),
                    map(user => new this.userModel(user)),
                    switchMap(user => from(user.save())
                        .pipe(
                            // tslint:disable-next-line:no-shadowed-variable
                            map(user => user.username),
                        ),
                    ),
                ),
            ),
        );
    }

    login(userData, res): any {
        return this.usersService.getUserByUsername(userData.username).pipe(
            filter(user => user !== null),
            map(user => user.validPassword(userData.password)),
            filter(isValid => isValid),
            switchMap(() => this.usersService.generateTokens(res, userData.username)),
        );
    }

    getUser(username) {
        return this.usersService.getUserByUsername(username);
    }

}
