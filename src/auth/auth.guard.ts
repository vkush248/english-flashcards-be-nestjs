import { CanActivate, ExecutionContext, Injectable, Request, UnauthorizedException } from '@nestjs/common';
// import * as jwt from 'jsonwebtoken';
import { Observable, of } from 'rxjs';
import { AuthService } from './services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService,
    ) { }
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateTokens(request);
    }

    validateTokens(@Request() request) {
        // If token is in payload return true
        // else if refreshToken is the same as in DB get new tokens
        if (request.cookies.accessToken) {
            // token = jwt.decode(request.cookies.accessToken);
            return of(true);
        }
        else {
            // console.log('access token has expired', request);
            if (request.cookies.refreshToken) {
                let tokenInDb;
                if (request.cookies.refreshToken === tokenInDb) {
                    return of(true);
                } else { return of(false); }
            } else {
                console.log('No refresh token');

            }
            throw new UnauthorizedException();
        }
    }
    getRefreshToken() {
        // this.authService.getUserByUsername('userlooser').pipe(pluck('refreshToken'), tap(refreshToken => console.log('refreshToken', refreshTokenrefreshToken)))
    }

}
