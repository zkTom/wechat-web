///<reference path="../types/ApiTypes.ts"/>

import Vue from 'vue';
import axios from 'axios';
import HttpError, { HttpErrorOptions } from '@/utils/HttpError.ts';
import router from '../router/index';
import db from '@/utils/localStorage.ts';

// 无需授权API白名单
const whiteLable = ['/api/console/login', '/api/console/register', '/api/console/getCaptcha'];
axios.interceptors.request.use(
    config => {
        return config;
    },
    error => {
        console.log(error);
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        const message = Vue.prototype.$toast.fail;

        let e: HttpErrorOptions = {
            message: '',
            workCode: '',
            status: 0
        };

        if (error.response) {
            const status = error.response.status;
            e.message = error.response.data.respMsg;
            e.workCode = error.response.data.respCode;
            e.status = status;
            switch (status) {
                case 400:
                    e.message = '参数错误';
                    message(e.message);
                    break;
                case 401:
                case 403:
                    message('用户信息失效,重新登录');
                    db.remove('Authorization');
                    router.replace({
                        path: '/login'
                    });
                    break;
                case 404:
                    e.message = '请求地址找不到';
                    message(e.message);
                    break;
                case 422:
                    console.log('传入后台的参数格式错误');
                    break;
                case 500:
                    e.message = '服务开小差了';
                    message(e.message);
                    break;
                case 502: //Bad Gateway
                case 503:
                    e.message = '服务不可用';
                    message(e.message);
                    break;
                case 504: //超时
                    e.message = '请求超时';
                    message(e.message);
                    break;
                default:
                    break;
            }
        } else {
            // 没有response且 error.message 为'Network Error' 本地网络错误
            // 或者是手动取消的请求
            e.status = 504;
            e.workCode = '9999';
            e.message = '请求超时，网络似乎出了点问题';
            console.log('服务器连接失败', error);
        }
        return Promise.reject(new HttpError(e));
    }
);
// headers: {}, 添加自定义请求头,
// encode: params是否需要编码

function ajax(
    method: ApiTypes.Method = 'GET',
    url = '',
    params: { [x: string]: any } = {},
    options: ApiTypes.AjaxOptions = {
        headers: {},
        encode: false
    }
) {
    const config: ApiTypes.Config = {
        baseURL: process.env.VUE_APP_URL,
        url,
        method,
        timeout: 5000,
        headers: {}
    };
    // 区分请求地址
    if (/^(\/reserve)/.test(url)) {
        config.baseURL = process.env.VUE_APP_URL_1;
        db.save('url', config.baseURL);
    } else if (/^(\/activity)/.test(url)) {
        config.baseURL = process.env.VUE_APP_URL_2;
        db.save('url', config.baseURL);
    }
    const token = db.get('Authorization', '');
    if (token.length > 0 && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
        if (whiteLable.indexOf(url) > -1) {
            delete config.headers['Authorization'];
        }
    }

    if (Object.keys(options.headers).length > 0 && config.headers) {
        for (let key in options.headers) {
            config.headers[key] = options.headers[key];
        }
    }
    // 对参数进行编码
    if (method === 'GET' && options.encode) {
        if (Object.keys(params).length > 0) {
            for (let key in params) {
                params[key] = encodeURIComponent(params[key]);
            }
        }
    }
    if (['PUT', 'POST', 'PATCH'].includes(method)) config.data = params;
    else config.params = params;

    return new Promise((resolve, reject) => {
        axios
            .request(config)
            .then(response => resolve(response.data))
            .catch(error => {
                console.log(error);
                reject(error);
            });
    });
}
export const POST = (url: string, params?: any) => {
    return ajax('POST', url, params);
};

export const GET = (url: string, params?: any) => {
    return ajax('GET', url, params);
};

export const PUT = (url: string, params?: any) => {
    return ajax('PUT', url, params);
};

export const DELETE = (url: string, params?: any) => {
    return ajax('DELETE', url, params);
};

export const PATCH = (url: string, params: any) => {
    return ajax('PATCH', url, params);
};

export default ajax;
