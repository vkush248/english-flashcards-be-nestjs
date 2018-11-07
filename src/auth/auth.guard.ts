import { CanActivate, ExecutionContext, Injectable, Request, Response } from '@nestjs/common';
import { Observable } from 'rxjs';
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

    validateTokens(@Request() request, @Response() response): any {
        return this.usersService.isLoggedIn(request, response);
    }

}
