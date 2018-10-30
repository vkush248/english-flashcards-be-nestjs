import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './controllers/auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './services/auth.service';
import { UsersService } from './services/users.service';
import { userSchema } from './user.schema';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secretOrPrivateKey: 'secretKey',
      signOptions: {
        expiresIn: 3600,
      },
    }),
    MongooseModule.forFeature([{ name: 'User', schema: userSchema }]),
  ],
  exports: [AuthService],
  controllers: [AuthController],
  providers: [UsersService, AuthService, JwtStrategy],
})
export class AuthModule {
  constructor() { }
}
