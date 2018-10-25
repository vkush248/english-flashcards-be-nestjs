import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, ForbiddenException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { AppError } from './app-error';

@Catch()
export class DispatchError implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost): any {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse();
        if (exception instanceof AppError) {
            return res.status(exception.httpStatus).json({
                errorCode: exception.errorCode,
                errorMsg: exception.errorMessage,
                usrMsg: exception.userMessage,
                httpCode: exception.httpStatus,
            });
        } else if (exception instanceof UnauthorizedException) {
            return res.status(HttpStatus.UNAUTHORIZED).json(exception.message);
        } else if (exception instanceof ForbiddenException) {
            return res.status(HttpStatus.FORBIDDEN).json(exception.message);
        }
        else if (exception instanceof BadRequestException) {
            return res.status(HttpStatus.BAD_REQUEST).json(exception.message);
        }
        else {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
        }
    }
}