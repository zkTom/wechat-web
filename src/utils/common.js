// 校验身份证号
export const IdCardValidator = (function () {
    // 对最后一位校验位进行校验
    function checkCode(val) {
        let p = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
        let factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        let parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
        let code = val.substring(17);
        if (p.test(val)) {
            let sum = 0;
            for (let i = 0; i < 17; i++) {
                sum += val[i] * factor[i];
            }
            if (parity[sum % 11].toString() === code.toUpperCase()) {
                return true;
            }
        }
        return false;
    }
    // 对日期部分进行校验
    // 年月日
    function checkDate(val) {
        val = val.substring(6, 14);
        let pattern = /^(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)$/;
        if (pattern.test(val)) {
            let year = val.substring(0, 4);
            let month = val.substring(4, 6);
            let date = val.substring(6, 8);
            let date2 = new Date(year + '-' + month + '-' + date);
            if (date2 && date2.getMonth() === parseInt(month) - 1) {
                return true;
            }
        }
        return false;
    }
    // 对省份部分进行校验
    function checkProv(val) {
        val = val.substring(0, 2);
        let pattern = /^[1-9][0-9]/;
        let provs = {
            11: '北京',
            12: '天津',
            13: '河北',
            14: '山西',
            15: '内蒙古',
            21: '辽宁',
            22: '吉林',
            23: '黑龙江 ',
            31: '上海',
            32: '江苏',
            33: '浙江',
            34: '安徽',
            35: '福建',
            36: '江西',
            37: '山东',
            41: '河南',
            42: '湖北 ',
            43: '湖南',
            44: '广东',
            45: '广西',
            46: '海南',
            50: '重庆',
            51: '四川',
            52: '贵州',
            53: '云南',
            54: '西藏 ',
            61: '陕西',
            62: '甘肃',
            63: '青海',
            64: '宁夏',
            65: '新疆'
            // 71: "台湾",
            // 81: "香港",
            // 82: "澳门"
        };
        if (pattern.test(val)) {
            if (provs[val]) {
                return true;
            }
        }
        return false;
    }
    // 校验基本长度
    function checkLength(val) {
        const reg = /((\d{14}[0-9Xx])|(\d{17}[0-9Xx]))/;
        return reg.test(val);
    }
    function checkIdCard(val) {
        return checkLength(val) && checkProv(val) && checkDate(val) && checkCode(val);
    }

    return {
        checkLength,
        checkCode,
        checkDate,
        checkProv,
        checkIdCard
    };
})();
/**
 * 电车编号校验
 * HD00001 两位字母加五位数字
 * */
export function checkEpcNum(val) {
    const reg = /^[A-Za-z]{2}[0-9]{6}$/i;
    return reg.test(val);
}
/**
 * 身份证校验
 */
export function checkPhoneNum(val) {
    const reg = /^1[3456789]\d{9}$/;
    return reg.test(val);
}
/**
 * 防止按钮连续点击
 * 目的：当上一次wrapperFn执行产生的 side effect（异步函数/延时函数）尚未解除，当次wrapperFn无法执行
 *
 * @param { Function } wrapperFn: 一个async/await函数
 * @return { Function } lockFn: 上锁之后的wrapperFn
 *  */

// 单独使用
// async function wrapper(event,params) {
//     console.log('wrapper arguments:', event, params);
//     try {
//         await new Promise(resolve => {
//             setTimeout(() => {
//                 resolve();
//             }, 1000)
//         })
//     } catch (error) {
//         console.log(error);
//     } finally {
//         console.log('wrapper finally');
//     }
// }
// lock(wrapper);
export function lock(wrapperFn) {
    let isLock;
    if (typeof wrapperFn === 'function') {
        const lockFn = async function (...rest) {
            if (isLock) return;

            isLock = true;

            // this指向外部组件
            await wrapperFn.call(this, ...rest).finally(() => {
                isLock = false;
            });
        };
        return lockFn;
    }

    return wrapperFn;
}
/**
 * 结构url
 * @param url
 * eg:
 * https://example.com?a=1&b=2 => { a: 1, b: 2 }
 * https://example.com => {}
 */
export function parseQs(qs) {
    const qry = {};
    const idx = qs.indexOf('?');
    if (idx > -1) {
        qs = qs.substring(idx + 1);
        const pairs = qs.split('&');
        pairs.forEach(pair => {
            const temp = pair.split('=');
            qry[decodeURIComponent(temp[0])] = decodeURIComponent(temp[1]);
        });
    }
    return qry;
}
// 防抖函数,理解
export function debounce(func, wait = 300, immediate) {
    let timeout, args, context, timestamp, result;

    const later = function () {
        const last = Date.now() - timestamp;

        if (last < wait && last >= 0) {
            timeout = setTimeout(later, wait - last);
        } else {
            timeout = null;
            if (!immediate) {
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            }
        }
    };

    return function () {
        context = this;
        args = arguments;
        timestamp = Date.now();
        const callNow = immediate && !timeout;
        if (!timeout) timeout = setTimeout(later, wait);
        if (callNow) {
            result = func.apply(context, args);
            context = args = null;
        }

        return result;
    };
}
/**
 * 检测URL地址
 */
export function checkHttpUrl(value) {
    const reg = /(http|https):\/\/([\w.]+\/?)\S*/;
    return reg.test(value);
}