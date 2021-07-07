declare namespace ApiTypes {
    export type Method =
        | 'get'
        | 'GET'
        | 'delete'
        | 'DELETE'
        | 'head'
        | 'HEAD'
        | 'options'
        | 'OPTIONS'
        | 'post'
        | 'POST'
        | 'put'
        | 'PUT'
        | 'patch'
        | 'PATCH';
    // 自定义发送头部
    export interface Headers {
        [x: string]: any;
    }
    // axios 配置
    export interface Config {
        [x: string]: any;
        baseURL: string;
        url: string;
        method: Method;
        timeout: number;
        headers?: Headers;
        data?: Object;
        params?: Object;
    }

    // 接口成功返回结果集
    export interface ResponseResult {
        [x: string]: any;
        respCode: string;
        respMsg: string;
        respData?: any;
    }
    // 接口失败返回结果集
    export interface ErrorResult {
        status: number;
        msg: string;
    }
    // ajax options
    interface AjaxOptions {
        headers: {
            [x: string]: any;
        };
        encode: boolean;
    }
}
