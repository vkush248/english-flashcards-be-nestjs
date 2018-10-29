import { CanActivate, ExecutionContext, Injectable, Request, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Observable, of } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateTokens(request);
    }

    validateTokens(@Request() request) {
        // If token is in payload return true
        // else if refreshToken is the same as in DB get new tokens
        let token: any;
        if (request.cookies.accessToken) {
            token = jwt.decode(request.cookies.accessToken);
            if (token) { return of(true); }
        }
        else {
            if (request.cookies.refreshToken) {

            } else {
                console.log('No refresh token');

            }
            throw new UnauthorizedException();
        }
    }

}
