import { ArgumentsHost, Catch, HttpException, HttpServer, Inject } from '@nestjs/common';
import { BaseExceptionFilter, HTTP_SERVER_REF } from '@nestjs/core';

@Catch()
export class HttpExceptionFilter extends BaseExceptionFilter {
    constructor(@Inject(HTTP_SERVER_REF) applicationRef: HttpServer) {
        super(applicationRef);
    }
    catch(exception: HttpException, host: ArgumentsHost): any {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception.getStatus();
        console.log('exception is caught');
        response.status(status).json({
            message: exception.message,
            statusCode: status,
            path: request.url,
        }).send();
    }
}