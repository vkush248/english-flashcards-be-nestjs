import { CanActivate, ExecutionContext, Injectable, Request, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Observable, of } from 'rxjs';
// import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateTokens(request);
    }

    validateTokens(@Request() request) {
        const token: any = jwt.decode(request.cookies.accessToken);
        if (token) return of(true);
        else throw new UnauthorizedException();
    }
}
