<template>
    <div class="appointment-container-wrap">
        <div v-if="loading" class="no-data">
            <van-loading type="spinner" color="#1989fa" vertical>加载中...</van-loading>
        </div>
        <div class="no-data" v-else-if="state === 0">
            <p>请在微信内打开此页面</p>
        </div>
        <div class="no-data" v-else-if="state === -1">
            <p>服务出错，请刷新页面重新进入</p>
        </div>
        <div class="appointment-container" v-else>
            <template v-if="state === 1">
                <img src="../../assets/img/reserve-bg-1.png" alt="" />
                <div class="form-wrap">
                    <div class="cell">
                        <div class="cell-input cell-input--suffix">
                            <input
                                class="cell-input__core"
                                type="text"
                                v-model="form.realName"
                                placeholder="请输入姓名"
                            />
                        </div>
                    </div>
                    <div class="cell">
                        <div class="cell-input cell-input--suffix">
                            <input
                                class="cell-input__core"
                                type="tel"
                                v-model="form.phone"
                                placeholder="请输入联系方式"
                            />
                        </div>
                    </div>
                    <div class="btn-wrap">
                        <van-button block type="danger" @click="onSubmit" color="#2B2942" style="border-radius: 10px;">
                            立即支付
                        </van-button>
                    </div>
                </div>
                <div class="intro">
                    <p class="title">活动须知</p>
                    <div class="items">
                        <span class="item">活动时间：即日起至赠完为止</span>
                        <span class="item">活动范围：目前仅限邯郸市区</span>
                        <span class="item special"
                            >此活动仅限到店安装用户安装地址：邯郸市滏东南大街明珠广场西楼河北在哪儿</span
                        >
                    </div>
                    <p class="title">活动流程</p>
                    <div class="items">
                        <span class="item">1、关注河北在哪儿公众号。</span>
                        <span class="item"
                            >2、进入微信公众号，输入“11”获取活动页面，进去页面后点击付款，付款完成后即可参与抽奖，前100名百分百中奖。</span
                        >
                        <span class="item"
                            >3、付款成功并抽奖后，请在工作日内出示付款记录以及抽奖结果到邯郸市滏东南大街明珠广场西楼河北在哪儿进行安装并领奖。</span
                        >
                    </div>
                </div>
                <p class="tip">
                    活动客服：18730076368
                </p>
            </template>
        </div>
    </div>
</template>
<script>
import { getWxH5Info1, activityOrder } from '../../api/userApi';
import { parseQs, checkPhoneNum, debounce } from '../../utils/common';

export default {
    name: 'DoubleEleven',
    data() {
        return {
            form: {
                phone: '',
                realName: '',
                openid: '',
                code: ''
            },
            state: 0,
            loading: true,
            showPicker: false
        };
    },
    watch: {
        'form.phone'(newV) {
            if (newV || newV.length > 11) {
                this.form.phone = newV.slice(0, 11);
            }
        }
    },
    created() {
        const o = parseQs(window.location.href);
        if (o && o['code']) {
            this.form.code = o['code'];
            this.initData(o['code']);
        } else {
            this.state = 0;
            this.form.code = null;
        }
    },
    mounted() {},
    methods: {
        async initData(code) {
            const key = '__11_openid__';
            // 获取localStorage的openid
            const openid = localStorage.getItem(key);
            if (openid) {
                this.form.openid = openid;
                this.loading = false;
                this.state = 1;
                return;
            }
            // code换openid和unionid
            this.loading = true;
            try {
                let res2 = await getWxH5Info1({ code });
                if (res2.respCode !== '0000') {
                    this.$toast.fail('参数错误，请退出页面重试');
                    this.state = -1;
                    return;
                }
                if (res2.respData.errcode) {
                    this.state = 0;
                    this.$toast.fail('请在微信内打开此页面');
                    return;
                }
                this.state = 1;
                this.form.openid = res2.respData.openid;
                // 存储到本地
                localStorage.setItem(key, res2.respData.openid);
            } catch (error) {
                this.$toast.fail('后台服务出错');
                this.state = -1;
            } finally {
                this.loading = false;
                this.url = window.location.href;
            }
        },
        checkForm() {
            let flag = false,
                errorMsg = '';
            const { openid, realName, phone } = this.form;
            if (!openid) {
                errorMsg = '参数错误，请重新打开页面';
            } else if (!realName) {
                errorMsg = '请填写姓名';
            } else if (!phone || !checkPhoneNum(phone)) {
                errorMsg = '手机号不正确';
            } else {
                flag = true;
            }
            if (errorMsg) {
                this.$toast.fail(errorMsg);
            }
            return flag;
        },
        onSubmit: debounce(async function() {
            // 校验表单数据
            if (!this.checkForm()) {
                return;
            }
            try {
                const res = await activityOrder(this.form);
                if (res.respCode !== '0000') {
                    this.$toast.fail(res.respMsg || '下单失败,请重试');
                    return;
                }

                // this.$toast.success('下单成功');
                // 调起支付
                let that = this;
                const { appId, timeStamp, nonceStr, signType, paySign } = res.respData;
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId, // 必填，公众号的唯一标识
                    timestamp: timeStamp, // 必填，生成签名的时间戳
                    nonceStr, // 必填，生成签名的随机串
                    signature: paySign, // 必填，签名
                    jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表
                });
                wx.error(function(res) {
                    console.log('error', res);
                    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
                });
                wx.ready(function() {
                    wx.chooseWXPay({
                        timestamp: timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                        nonceStr, // 支付签名随机串，不长于 32 位
                        package: res.respData.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                        signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                        paySign, // 支付签名
                        success: function(res) {
                            // 支付成功后的回调函数
                            if (res.errMsg === 'chooseWXPay:ok') {
                                that.$dialog
                                    .alert({
                                        message: '支付成功，您获得一次抽奖机会',
                                        theme: 'round-button'
                                    })
                                    .then(() => {
                                        window.location.href = `/pages/double-eleven-game.html?openid=${
                                            that.form.openid
                                        }&t=${new Date().getTime()}`;
                                    });
                            } else {
                                that.$toast.fail('支付未完成');
                            }
                        }
                    });
                });
            } catch (error) {
                this.$toast.fail('fail');
            }
        }, 300),
        onSubmit1: debounce(async function() {
            // 校验表单数据
            if (!this.checkForm()) {
                return;
            }
            try {
                const res = await activityOrder(this.form);
                if (res.respCode !== '0000') {
                    this.$toast.fail(res.respMsg || '下单失败,请重试');
                    return;
                }
                this.$toast.success('下单成功');
                // 调起支付
                if (typeof WeixinJSBridge === 'undefined') {
                    this.$toast.fail('请使用微信内置浏览器进行支付');
                } else {
                    let that = this;
                    const { appId, timeStamp, nonceStr, signType, paySign } = res.respData;
                    WeixinJSBridge.invoke(
                        'getBrandWCPayRequest',
                        {
                            appId, //公众号名称，由商户传入
                            timeStamp, //时间戳，自1970年以来的秒数
                            nonceStr, //随机串
                            package: res.respData.package,
                            signType, //微信签名方式：
                            paySign //微信签名
                        },
                        function(res) {
                            // 隐藏下面的状态栏
                            WeixinJSBridge.call('hideToolbar');
                            if (res.err_msg === 'get_brand_wcpay_request:ok') {
                                // 使用以上方式判断前端返回,微信团队郑重提示：
                                //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                                // window.location.href = '/pages/order-result.html';
                                that.$dialog
                                    .alert({
                                        message: '支付成功，您获得一次抽奖机会',
                                        theme: 'round-button'
                                    })
                                    .then(() => {
                                        window.location.href = `/pages/double-eleven-game.html?openid=${
                                            that.form.openid
                                        }&t=${new Date().getTime()}`;
                                    });
                            } else if (
                                res.err_msg === 'get_brand_wcpay_request:cancel' ||
                                res.err_msg === 'get_brand_wcpay_request:fail'
                            ) {
                                // 用户取消支付或者长时间未完成支付
                                that.$toast.fail('支付未完成');
                            }
                        }
                    );
                }
            } catch (error) {
                this.$toast.fail(error);
            }
        }, 300),
        onConfirm(value) {
            this.form.distance = value;
            this.showPicker = false;
        }
    }
};
</script>
<style lang="scss" scoped>
.appointment-container {
    background-color: #2b2942;
    width: 100%;

    &-wrap {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        min-height: 100vh;
        font-family: 'PingFangSC-Semibold', 'PingFang SC', 'Helvetica Neue', Helvetica, 'microsoft yahei', arial,
            STHeiTi, sans-serif;
    }
    img {
        width: 100%;
    }
    .intro {
        margin: 50px 30px 0;
        padding: 20px 40px 40px;
        /* background: #238ef2; */
        border-radius: 20px;

        .items {
            display: flex;
            flex-direction: column;
        }
        .items:last-child {
            margin-bottom: 30px;
        }
        .title {
            font-size: 34px;
            font-weight: 800;
            color: #e5e7f9;
            line-height: 48px;
            margin-bottom: 16px;
            margin-top: 28px;
        }
        .item {
            font-size: 28px;
            font-weight: 500;
            color: #e5e7f9;
            line-height: 34px;
        }
        .item.special {
            padding-top: 40px;
            font-size: 30px;
            font-weight: 400;
            color: #fdedc1;
            line-height: 40px;
        }
    }
    .form-wrap {
        background-color: #ecefff;
        border-radius: 10px;
        margin: -250px 30px 0;
        padding: 60px 40px;
        display: flex;
        flex-direction: column;
        position: relative;
        z-index: 1;
    }

    .distance {
        border-bottom: 2px solid rgba(185, 185, 185, 0.5);
        display: flex;
        position: relative;
        flex-flow: row wrap;
        align-items: center;
        justify-content: flex-start;
        height: 100px;

        &-wrap {
            border: 2px solid rgba(185, 185, 185, 0.5);
            border-radius: 10px;
            display: flex;
            flex-direction: column;
            font-size: 32px;
            font-weight: 300;
            color: #999;
            text-align: center;
        }
        .addr1 {
            width: 200px;
            border-right: 2px solid rgba(185, 185, 185, 0.5);
        }
        .addr2 {
            display: flex;
            flex: 1;
            align-items: center;
            justify-content: space-between;
            padding-left: 90px;
            padding-right: 30px;
        }
    }
    .tip {
        font-size: 24px;
        font-weight: 300;
        color: #fff;
        line-height: 32px;
        margin-top: 60px;
        margin-bottom: 40px;
        text-align: center;
    }
    .btn-wrap {
        margin: 40px 0 0;
    }

    .no-data {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>
<style>
/** 输入框公共样式 */
.cell {
    border: 2px solid rgba(185, 185, 185, 0.5);
    border-radius: 10px;
    display: flex;
    position: relative;
    flex-flow: row wrap;
    align-items: center;
    justify-content: flex-start;
    height: 100px;
    margin-bottom: 30px;
}
.cell.no-border {
    border: none;
    border-radius: 0;
    margin-bottom: 0;
}
.cell.state--error {
    border-color: #e02020;
}

.cell:last-child .cell-state__error {
    bottom: 3px;
}

.cell-label {
    padding-left: 30px;
    font-size: 28px;
    font-weight: 300;
    color: rgba(153, 153, 153, 1);
}

.cell-state__error {
    position: absolute;
    left: 20rpx;
    bottom: 0;
    font-size: 24rpx;
    color: #e02020;
}

.cell-input {
    border: none;
    box-sizing: border-box;
    position: relative;
    padding: 0 30px;
    display: flex;
    align-items: center;
    flex: 1;
}

.cell-input__core {
    appearance: none;
    background-color: #ecefff;
    background-image: none;
    box-sizing: border-box;
    flex: 1;
    font-size: 32px;
    font-weight: 300;
    width: 100%;
    color: #999999;
    outline: none;
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.cell-input.cell-input--suffix .cell-input__core {
    padding-right: 30rpx;
}

.cell-input__suffix {
    width: 60rpx;
    display: flex;
    align-items: center;
    flex: none;
    justify-content: center;
    color: #c0c4cc;
    transition: all 0.3s;
}

.cell-input__suffix-inner {
    font-size: 32rpx;
    color: inherit;
}

.cell-input__placeholder {
    font-size: 28rpx;
    font-weight: 300;
    color: rgba(153, 153, 153, 1);
}
</style>
