import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'auth/interfaces/user.interface';
import { Model } from 'mongoose';
import { from, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UsersService } from './users.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService,
    ) { }

    async createToken(user: JwtPayload) {
        const accessToken = this.jwtService.sign(user);
        return {
            expiresIn: 3600,
            accessToken,
        };
    }

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
        // when user registers we send userid and
        // keep it in store
    }

    login(userData): any {
        const user$ = this.getUserByUsername(userData.username).pipe(
            map(user => user.validPassword(userData.password)),
        );
        return user$;
    }

    async validateUser(token: string): Promise<any> {
        // Validate if token passed along with HTTP request
        // is associated with any registered account in the database
    }

    getUserByUsername(username): Observable<any> {
        return from(this.userModel.findOne({ username }).exec());
    }

    getJwt(username): Observable<any> {
        return this.getUserByUsername(username).pipe(
            map(user => ({ accessToken: user.generateJwt('access'), refreshToken: user.generateJwt('refresh') })),
        );
    }

}

/*
    async login(userData): Promise<object> {

        const auser = await this.getUser(userData);
        const user: any = new this.userModel(auser);
        const isValid = await user.validPassword(userData.password);
        const message = isValid ? 'Welcome' : 'Access denied';
        return { isValid, message, username: userData.username };

    }
*/