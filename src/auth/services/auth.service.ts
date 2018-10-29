import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'auth/interfaces/user.interface';
import { decode } from 'jsonwebtoken';
import { Model } from 'mongoose';
import { from, Observable, of } from 'rxjs';
import { filter, map, pluck, switchMap, tap } from 'rxjs/operators';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UsersService } from './users.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService,
    ) { }

    register(userData: JwtPayload): Observable<string> {
        const user$ = of(this.usersService.setPassword(userData.password))
            .pipe(
                tap(x => console.log(x)),
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

    login(userData): any {
        const user$ = this.getUserByUsername(userData.username).pipe(
            map(user => user.validPassword(userData.password)),
            filter(isValid => isValid),
            switchMap(() => this.getJwts(userData.username)),
            switchMap((tokens) => this.updateUser(userData.username, tokens.refreshToken)),
            tap(user => console.log(user)),
        );
        return user$;
    }

    getUserByUsername(username): Observable<any> {
        const user$ = this.userModel.findOne({ username }).exec();
        return from(user$);
    }

    updateUser(username, update) {
        return from(this.userModel.findOneAndUpdate({ username }, { refreshToken: update }).exec());
    }

    getJwts(username): Observable<any> {
        return this.getUserByUsername(username).pipe(
            map(user => ({ accessToken: user.generateJwt('access'), refreshToken: user.generateJwt('refresh') })),
        );
    }

    validateRefreshToken(refreshToken, username) {
        console.log('im inside');
        const token = decode(refreshToken);
        this.getUserByUsername(username).pipe(
            pluck('refreshToken'),
            map(refreshToken => refreshToken === token),
            tap(x => console.log(x)),
        );
        if (token === token) { return of(true); }
    }

}
