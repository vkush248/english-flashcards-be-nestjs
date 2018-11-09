import { HTTP_SERVER_REF, NestFactory } from '@nestjs/core';
import { HttpExceptionFilter } from 'common/exception.filter';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const httpRef = app.get(HTTP_SERVER_REF);
  app.useGlobalFilters(new HttpExceptionFilter(httpRef));
  app.use(session({
    secret: 'Come to the Dark side',
    name: 'sessionId',
    cookie: {
      httpOnly: true,
    },
    resave: true,
    saveUninitialized: false,
  }));
  app.use(passport.initialize());
  app.use(cookieParser());
  await app.listen(3000);
}

bootstrap();
