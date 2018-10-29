import { NestFactory } from '@nestjs/core';
import { HttpExceptionFilter } from 'common/exception.filter';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(session({
    secret: 'Come to the Dark side',
    name: 'sessionId',
    cookie: {
      secure: true,
      httpOnly: true,
    },
    resave: false,
    saveUninitialized: false,
  }));
  app.use(passport.initialize());
  app.use(cookieParser());
  app.use(passport.session());
  await app.listen(3000);
}

bootstrap();
