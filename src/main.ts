import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import * as passport from 'passport';
import { AppModule } from './app.module';

const expiryDate = new Date(Date.now() + 60 * 60 * 1000);
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(session({
    secret: 'Come to the Dark side',
    name: 'sessionId',
    cookie: {
      secure: true,
      httpOnly: true,
      expires: expiryDate,
    },
    resave: false,
    saveUninitialized: false,
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(3000);
}

bootstrap();
