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
                <img src="../../assets/img/reserve-bg.png" alt="" />
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
                    <div class="distance-wrap">
                        <div class="distance">
                            <div class="addr1">邯郸市</div>
                            <div class="addr2" @click="showPicker = true">
                                <span>{{ form.distance || '选择地区' }}</span>
                                <van-icon name="arrow-down" color="#D8D8D8" />
                            </div>
                        </div>
                        <div class="cell no-border">
                            <div class="cell-input cell-input--suffix">
                                <input
                                    class="cell-input__core"
                                    type="text"
                                    v-model="form.addr"
                                    placeholder="请输入详细地址"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="btn-wrap">
                    <van-button block type="danger" @click="onSubmit">
                        提交预约
                    </van-button>
                </div>
                <div class="intro">
                    <p class="title">活动须知</p>
                    <div class="items">
                        <span class="item">活动时间：即日起—2020年11月30日</span>
                        <span class="item">活动范围：目前仅限邯郸市区</span>
                        <span class="item">注：如不在市区视为无效订单，如支付成功，可联系客服申请退款。</span>
                    </div>
                    <p class="title">活动流程</p>
                    <div class="items">
                        <span class="item">1、扫描二维码，关注“河北在哪儿”微信公众号。</span>
                        <span class="item">2、进入“河北在哪儿”微信公众号点击“优惠券”，领取20元的微信卡券。</span>
                        <span class="item">3、点击 “河北在哪儿”微信公众 “预约安装”菜单。</span>
                        <span class="item"
                            >4、工作人员将在24小时内与您联系，确定安装时间。 安装人员会与您进行二次确认。</span
                        >
                    </div>
                </div>
                <p class="tip">
                    活动客服：18730076368
                </p>
            </template>
            <!-- 地区选择弹框 -->
            <van-popup v-model="showPicker" round position="bottom">
                <van-picker show-toolbar :columns="columns" @cancel="showPicker = false" @confirm="onConfirm" />
            </van-popup>
        </div>
    </div>
</template>
<script>
import { getWxH5Info, reserveOrder } from '../../api/userApi';
import { parseQs, checkPhoneNum, debounce } from '../../utils/common';

export default {
    name: 'OrderForm',
    data() {
        return {
            form: {
                phone: '',
                realName: '',
                openid: '',
                distance: '',
                addr: '',
                code: ''
            },
            state: 0,
            loading: true,
            showPicker: false,
            columns: ['邯山区', '丛台区', '复兴区', '高开区']
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
            // code换openid和unionid
            this.loading = true;
            try {
                let res2 = await getWxH5Info({ code });
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
            const { openid, realName, phone, distance, addr } = this.form;
            if (!openid) {
                errorMsg = '参数错误，请重新打开页面';
            } else if (!realName) {
                errorMsg = '请填写姓名';
            } else if (!phone || !checkPhoneNum(phone)) {
                errorMsg = '手机号不正确';
            } else if (!distance) {
                errorMsg = '请选择地区';
            } else if (!addr) {
                errorMsg = '请填写详细地址';
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
                const res = await reserveOrder(this.form);
                if (res.respCode !== '0000') {
                    this.$toast.fail('下单失败,请重试');
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
                            if (res.err_msg === 'get_brand_wcpay_request:ok') {
                                // 使用以上方式判断前端返回,微信团队郑重提示：
                                //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                                window.location.href = '/pages/order-result.html';
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
    background-color: #1a3398;
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
        margin: 80px 30px 0;
        padding: 20px 40px 40px;
        background: #238ef2;
        border-radius: 20px;

        .items {
            display: flex;
            flex-direction: column;
        }
        .items:last-child {
            margin-bottom: 30px;
        }
        .title {
            font-size: 30px;
            font-weight: 800;
            color: #ffffff;
            line-height: 48px;
            margin-bottom: 16px;
            margin-top: 28px;
        }
        .item {
            font-size: 24px;
            font-weight: 500;
            color: #ffffff;
            line-height: 34px;
        }
    }
    .form-wrap {
        background-color: #fff;
        border-radius: 10px;
        margin: 0 30px;
        margin-top: -60px;
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
        color: #238ef2;
        line-height: 32px;
        margin-top: 60px;
        margin-bottom: 40px;
        text-align: center;
    }
    .btn-wrap {
        margin: 40px 30px 0;
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
    background-color: #fff;
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
