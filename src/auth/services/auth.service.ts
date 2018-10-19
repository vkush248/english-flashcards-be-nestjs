import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'auth/interfaces/user.interface';
import { Model } from 'mongoose';
import { from, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
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
        const user$ = this.getUserByUsername(userData).pipe(
            tap(x => console.log('There you go', x)),
            map(password => ({ ...password, ...userData })),
            map(user => new this.userModel(user)),
            switchMap(user => user.save()),
        );
        return user$;
        // const isValid = await user.validPassword(userData.password);
        // return { isValid, username: userData.username };
        // when user logs in we send userid and array of cards' ids of this user
        // and keep it in store
        // get rid of password and salt.
    }

    getUserByUsername(username): Observable<any> {
        return of(this.userModel.findOne({ username }));
        // return await this.userModel.findOne({ username: userData.username }).lean();
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