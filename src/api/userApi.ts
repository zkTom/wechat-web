///<reference path="../types/UserApiTypes.ts"/>
import * as api from './request';

export function register(params: UserApiTypes.registerParams) {
    return api.POST('/api/console/register', params);
}
export function getCaptcha() {
    return api.GET('/api/console/getCaptcha');
}
export function login(params: UserApiTypes.loginParams) {
    return api.POST('/api/console/login', params);
}
export function getUserInfoByToken() {
    return api.POST('/api/console/getUserInfoByToken');
}
/**
 * 微信h5页面授权，已被邀请过会被拦截
 * code
 */
export function getWxH5Info(params: any) {
    return api.POST('/reserve/getWxH5Info', params);
}
/**
 * 在线下单
 */
export function reserveOrder(params: any) {
    return api.POST('/reserve/reserveOrder', params);
}
/**
 * 微信H5页面授权
 */
export function getWxH5Info1(params: any) {
    return api.POST('/activity/getWxH5Info', params);
}
/**
 * 预约上门安装接口
 */
export function activityOrder(params: any) {
    return api.POST('/activity/activityOrder', params);
}
/**
 * 判断是否弹出抽奖页面
 */
export function isCanLottery(params: any) {
    return api.POST('/activity/isCanLottery', params);
}
/**
 * 开始抽奖
 */
export function activityLottery(params: any) {
    return api.POST('/activity/activityLottery', params);
}
