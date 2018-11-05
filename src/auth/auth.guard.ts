import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, Request, Response } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { UsersService } from './services/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly usersService: UsersService,
    ) { }
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        return this.validateTokens(request, response);
    }

    validateTokens(@Request() request, @Response() response): Observable<boolean> {
        if (request.cookies.accessToken) {
            return of(true);
        }
        else {
            if (request.cookies.refreshToken) {
                return this.usersService.getRefreshToken(request.cookies.username).pipe(
                    tap(x => console.log(x, x === request.cookies.refreshToken, request.cookies.refreshToken)),
                    map(refreshToken => refreshToken === request.cookies.refreshToken),
                    tap(isAuthentic => {
                        if (!isAuthentic) {
                            throw new HttpException('Refresh token is not valid.', HttpStatus.UNAUTHORIZED);
                        } else { return isAuthentic; }
                    }),
                    filter(isAuthentic => isAuthentic),
                    switchMap(() => this.usersService.saveTokens(response, request.cookies.username)),
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
