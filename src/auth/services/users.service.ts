import { HttpException, HttpStatus, Injectable, Response } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'auth/interfaces/user.interface';
import { userSchema } from 'auth/user.schema';
import { Model } from 'mongoose';
import { from, Observable } from 'rxjs';
import { map, pluck, switchMap, tap } from 'rxjs/operators';

@Injectable()
export class UsersService {
    constructor(@InjectModel('User') private readonly userModel: Model<User>) { }

    getUserByUsername(username: string): Observable<any> {
        return from(this.userModel.findOne({ username }).exec()).pipe(
            tap((user: User) => {
                if (user) {
                    return user;
                } else {
                    throw new HttpException('Invalid username or password.', HttpStatus.FORBIDDEN);
                }
            }),
        );
    }

    doesUserExist(username: string): Observable<boolean> {
        return from(this.userModel.findOne({ username }).exec()).pipe(
            map(user => user !== null),
        );
    }

    setPassword(password: string): { password: string, salt: string } {
        userSchema.methods.setPassword(password);
        return { password: userSchema.methods.hash, salt: userSchema.methods.salt };
    }

    getRefreshToken(username: string): Observable<string> {
        return this.getUserByUsername(username).pipe(
            pluck('refreshToken'),
            tap((token: string) => {
                if (token) {
                    return token;
                } else {
                    throw new HttpException('Please log in', HttpStatus.UNAUTHORIZED);
                }
            }),
        );
    }

    updateUser(username, update) {
        return from(this.userModel.findOneAndUpdate({ username }, update).exec());
        // return from(this.userModel.findOneAndUpdate({ username }, { [update.key]: update.value }).exec());
    }

    generateJwts(username): Observable<any> {
        return this.getUserByUsername(username).pipe(
            map(user => ({ accessToken: user.generateJwt('access'), refreshToken: user.generateJwt('refresh') })),
        );
    }

    saveTokens(@Response() res, username) {
        return this.generateJwts(username).pipe(
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
            switchMap(tokens => this.updateUser(username, { refreshToken: tokens.refreshToken })),
        );
    }
}
