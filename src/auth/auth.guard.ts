import { CanActivate, ExecutionContext, Injectable, Request, Response, UnauthorizedException } from '@nestjs/common';
// import * as jwt from 'jsonwebtoken';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
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
        const response = context.switchToHttp().getResponse();
        return this.validateTokens(request, response);
    }

    validateTokens(@Request() request, @Response() response) {
        // If token is in payload return true
        // else if refreshToken is the same as in DB get new tokens
        if (request.cookies.accessToken) {
            return of(true);
        }
        else {
            if (request.cookies.refreshToken) {
                return this.authService.getRefreshToken(request.cookies.username).pipe(
                    tap(x => console.log(x === request.cookies.refreshToken)),
                    map(refreshToken => refreshToken === request.cookies.refreshToken),
                    tap(isAuthentic => {
                        isAuthentic && this.authService.saveTokens(response, request.cookies.username).subscribe();
                    }),
                );
            } else {
                console.log('No refresh token');
                return of(false);
                // throw exception
            }
            throw new UnauthorizedException();
        }
    }

}
