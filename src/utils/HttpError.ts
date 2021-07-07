/**
 * options:
 * options.type // 错误类型
 * options.message //错误提示信息
 * options.status // HttpCode
 * options.workCode // 业务状态码
 */
export interface HttpErrorOptions {
    message: string;
    workCode: string;
    status: number;
}
export default class HttpError {
    static type = 'HTTP_ERROR';
    message: string;
    statusCode: number;

    constructor(options: HttpErrorOptions) {
        this.message = options.message || '接口出错';
        this.statusCode = options.status || 0;
    }
    getType() {
        return HttpError.type;
    }
}
