import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
    findOneByEmail(email) {
        return email;
    }
}
