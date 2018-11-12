import { HttpException, HttpStatus, Injectable, Response } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tokens } from 'auth/interfaces/tokens.interface';
import { User } from 'auth/interfaces/user.interface';
import { userSchema } from 'auth/user.schema';
import { Model } from 'mongoose';
import { from, Observable, of } from 'rxjs';
import { filter, map, pluck, switchMap, tap } from 'rxjs/operators';

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
            map((user: User) => user !== null),
        );
    }

    setPassword(password: string): { password: string, salt: string } {
        userSchema.methods.setPassword(password);
        return { password: userSchema.methods.hash, salt: userSchema.methods.salt };
    }

    getRefreshToken(username: string): Observable<string> {
        return from(this.getUserByUsername(username).pipe(
            pluck('refreshToken'),
            tap((token: string) => {
                if (token) {
                    return token;
                } else {
                    throw new HttpException('Please log in', HttpStatus.UNAUTHORIZED);
                }
            }),
        ),
        );
    }

    updateUser(username, update): Observable<User> {
        return from(this.userModel.findOneAndUpdate({ username }, update).exec());
        // .pipe(switchMap(() => this.getUserByUsername(username)), tap(user => console.log(user.cards)));
    }

    generateJwts(username): Observable<Tokens> {
        return this.getUserByUsername(username).pipe(
            map(user => ({ accessToken: user.generateJwt('access'), refreshToken: user.generateJwt('refresh') })),
        );
    }

    saveTokens(@Response() res, username): Observable<User> {
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

    clearCookie(request, response): Observable<boolean> {
        const cookies = request.cookies;
        for (const prop in cookies) {
            if (!cookies.hasOwnProperty(prop)) {
                continue;
            }
            response.cookie(prop, '', {
                expires: new Date(0),
                httpOnly: true,
            });
        }
        return of(true);
    }

    destroySession(session): Observable<boolean> {
        session.destroy();
        return of(true);
    }

    blacklistToken(username, refreshToken): Observable<any> {
        return this.updateUser(username, { $push: { blacklistedTokens: refreshToken } });
    }

    deleteToken(username): Observable<User> {
        return this.updateUser(username, { refreshToken: '' });
    }

    checkTokenInBlacklist(username, token): Observable<boolean> {
        return this.getUserByUsername(username).pipe(
            pluck('blacklistedTokens'),
            map((blacklistedTokens: string[]) => blacklistedTokens.every(blacklistedToken => blacklistedToken !== token)),
        );
    }

    isLoggedIn(request, response): Observable<boolean> {
        if (request.cookies.accessToken) {
            return of(true);
        }
        else {
            if (request.cookies.refreshToken) {
                return this.getRefreshToken(request.cookies.username).pipe(
                    map(refreshToken => {
                        const isAuthentic = refreshToken === request.cookies.refreshToken;
                        return { isAuthentic, refreshToken };
                    }),
                    tap((refreshTokenObject: any) => {
                        if (!refreshTokenObject.isAuthentic) {
                            throw new HttpException('Refresh token is not valid.', HttpStatus.UNAUTHORIZED);
                        } else { return refreshTokenObject; }
                    }),
                    filter(refreshTokenObject => refreshTokenObject.isAuthentic),
                    switchMap(refreshTokenObject => this.checkTokenInBlacklist(request.cookies.username, refreshTokenObject.refreshToken)),
                    switchMap(() => this.saveTokens(response, request.cookies.username)),
                    map(tokens => {
                        if (!tokens) {
                            throw new HttpException('Refresh token is not valid.', HttpStatus.UNAUTHORIZED);
                        }
                        else {
                            return true;
                        }
                    }),
                );
            } else {
                throw new HttpException('Refresh token has expired.', HttpStatus.UNAUTHORIZED);
            }
        }
    }
}
