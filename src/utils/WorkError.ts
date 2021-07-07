/**
 * options:
 * options.type // 错误类型
 * options.message //错误提示信息
 * options.workCode // workCode
 */
export interface WorkErrorOptions {
    message: string;
    workCode: string;
}
export default class WorkError extends Error {
    static type = 'WORK_ERROR';
    [x: string]: any;
    message: string;
    workCode: string;

    constructor(options: WorkErrorOptions) {
        super(options.message || '业务出错');
        WorkError.type = 'WORK_ERROR';
        this.message = options.message || '业务出错';
        this.workCode = options.workCode || '9999';
    }

    addOption(key: string, value: any) {
        this[key] = value;

        return this;
    }
    getType() {
        return WorkError.type;
    }
}
