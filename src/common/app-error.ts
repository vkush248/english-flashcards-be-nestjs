import { HttpStatus } from '@nestjs/common';

export const enum AppErrorTypeEnum {
    USER_NOT_FOUND,
    UNAUTHORIZED,
    NOT_IN_SESSION,
    NO_USERS_IN_DB,
}
export interface IErrorMessage {
    type: AppErrorTypeEnum;
    httpStatus: HttpStatus;
    errorMessage: string;
    userMessage: string;
}

export class AppError extends Error {
    public errorCode: AppErrorTypeEnum;
    public httpStatus: number;
    public errorMessage: string;
    public userMessage: string;
    constructor(errorCode: AppErrorTypeEnum) {
        super();
        const errorMessageConfig: IErrorMessage = this.getError(errorCode);
        if (!errorMessageConfig) throw new Error('Unable to find message code error.');
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.httpStatus = errorMessageConfig.httpStatus;
        this.errorCode = errorCode;
        this.errorMessage = errorMessageConfig.errorMessage;
        this.userMessage = errorMessageConfig.userMessage;
    }
    private getError(errorCode: AppErrorTypeEnum): IErrorMessage {
        let res: IErrorMessage;
        switch (errorCode) {
            case AppErrorTypeEnum.UNAUTHORIZED:
                res = {
                    type: AppErrorTypeEnum.UNAUTHORIZED,
                    httpStatus: HttpStatus.UNAUTHORIZED,
                    errorMessage: 'Unathorized',
                    userMessage: 'Unathorized. Please log in.',
                };
                break;
            case AppErrorTypeEnum.USER_NOT_FOUND:
                res = {
                    type: AppErrorTypeEnum.USER_NOT_FOUND,
                    httpStatus: HttpStatus.BAD_REQUEST,
                    errorMessage: 'User not found',
                    userMessage: 'Unable to find the user with the provided information.',
                };
                break;
        }
        return res;
    }
}