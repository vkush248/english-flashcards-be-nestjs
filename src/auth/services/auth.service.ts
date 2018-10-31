import { Injectable, Response } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'auth/interfaces/user.interface';
import { Model } from 'mongoose';
import { from, Observable, of } from 'rxjs';
import { filter, map, pluck, switchMap, tap } from 'rxjs/operators';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UsersService } from './users.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
        private readonly usersService: UsersService,
    ) { }

    register(userData: JwtPayload): Observable<string> {
        const user$ = of(this.usersService.setPassword(userData.password))
            .pipe(
                map(user => ({ ...userData, ...user })),
                map(user => new this.userModel(user)),
                switchMap(user =>
                    from(user.save())
                        // tslint:disable-next-line:no-shadowed-variable
                        .pipe(map(user => user.username)),
                ),
            );
        return user$;
    }

    login(userData, res): any {
        return this.getUserByUsername(userData.username).pipe(
            filter(user => user),
            map(user => user.validPassword(userData.password)),
            filter(isValid => isValid),
            switchMap(tokens => this.generateTokens(res, userData.username)),
        );
    }

    getUserByUsername(username): Observable<any> {
        const user$ = this.userModel.findOne({ username }).exec();
        // if user isn't found throw exception
        return from(user$).pipe(
            tap(user => {
                if (!user) {
                    console.log(1);
                    // throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
                }
            }),
        );
    }

    getRefreshToken(username): Observable<string> {
        return this.getUserByUsername(username).pipe(
            pluck('refreshToken'),
        );
        // if token isn't in the db throw exception
    }

    updateRefreshToken(username, update) {
        return from(this.userModel.findOneAndUpdate({ username }, { refreshToken: update }).exec());
    }

    generateTokens(@Response() res, username) {
        return this.getJwts(username).pipe(
            tap(tokens => {
                res.cookie('accessToken', tokens.accessToken, {
                    expires: new Date(Date.now() + 60000 * 15),
                    httpOnly: true,
                });
                res.cookie('refreshToken', tokens.refreshToken, {
                    expires: new Date(Date.now() + 60000 * 60 * 24 * 30),
                    httpOnly: true,
                });
                res.cookie('username', username, {
                    expires: new Date(Date.now() + 60000 * 60 * 24 * 30),
                    httpOnly: true,
                });
                return tokens;
            }),
            switchMap(tokens => this.updateRefreshToken(username, tokens.refreshToken)),
        );
    }

    getJwts(username): Observable<any> {
        return this.getUserByUsername(username).pipe(
            map(user => ({ accessToken: user.generateJwt('access'), refreshToken: user.generateJwt('refresh') })),
        );
    }

}
