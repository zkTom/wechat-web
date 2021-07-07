<template>
    <div class="wechat-receive-form">
        <van-notice-bar :text="noticeTitle" left-icon="volume-o" @click="showTip" />
        <!--
            <div class="wechat-receive-form-head">
            <p class="title">河北在哪电车推广活动</p>
            <p class="subtitle">活动须知</p>
        </div>
         -->
        <van-cell-group style="margin-top: 30px;">
            <van-field
                type="tel"
                v-model="form.phoneNum"
                required
                clearable
                label="手机号"
                placeholder="请输入手机号"
                :error-message="phoneErrorMsg"
            />
        </van-cell-group>
        <van-button
            style="margin:20px 10px;"
            type="primary"
            :disabled="btnDisable"
            :loading="btnDisable"
            loading-text="加载中..."
            @click="submit"
            >领取红包</van-button
        >
        <div class="wechat-receive-form-footer">
            <p class="p1">地址：邯郸市邯山区陵园路与滏东南大街交叉口明珠广场</p>
            <p class="p2">联系电话：0310-8372110</p>
        </div>
    </div>
</template>
<script>
import { checkPhoneNum } from '@/utils/common.js';
import { queryCountByEpcNumAndIdCardNum } from '@/api/eviReceiveRecord.js';
const NOTICE_TITLE = '河北在哪电车推广活动活动须知';
const NOTICE_TEXT = '1. 每个手机号只能领取一次\n2. 每个微信号最多只能领取三次';
export default {
    name: 'WechatReceiveForm',
    data() {
        return {
            form: {
                phoneNum: '',
                openId: ''
            },
            noticeTitle: NOTICE_TITLE,
            phoneErrorMsg: '',
            btnDisable: false
        };
    },
    watch: {
        'form.phoneNum': {
            handler(val) {
                if (val.length === 0) {
                    this.phoneErrorMsg = '手机号不能为空';
                } else if (checkPhoneNum(val)) {
                    this.phoneErrorMsg = '';
                } else {
                    this.phoneErrorMsg = '手机号格式错误';
                }
            },
            immediate: true
        }
    },
    mounted() {
        this.form.openId = document.getElementById('hidden-open-id').value;
    },
    methods: {
        submit() {
            // 禁止连续点击
            if (this.btnDisable) return;
            // 检查表单
            if (!this.checkForm()) return;
            //submit
            this.btnDisable = true;
            queryCountByEpcNumAndIdCardNum(this.form)
                .then(res => {
                    return new Promise((resolve, reject) => {
                        setTimeout(() => {
                            const { code, msg } = res;
                            if (code === '10000') {
                                this.$toast.success(msg);
                                resolve(res);
                            } else {
                                this.$toast.fail(msg);
                                reject({ code, message: msg });
                            }
                        }, 500);
                    });
                })
                .then(() => {
                    return new Promise(resolve => {
                        setTimeout(() => {
                            resolve();
                            WeixinJSBridge && WeixinJSBridge.call('closeWindow');
                        }, 1000);
                    });
                })
                //网络错误 || 业务代码错误
                .catch(err => {
                    console.log(err);
                    this.$toast.fail(err.message || '未知错误，请重试');
                })
                .finally(() => {
                    this.btnDisable = false;
                });
        },
        checkForm() {
            return this.phoneErrorMsg.length === 0;
        },
        showTip() {
            this.$dialog
                .alert({
                    messageAlign: 'left',
                    title: NOTICE_TITLE,
                    message: NOTICE_TEXT
                })
                .then(() => {
                    // on close
                });
        }
    }
};
</script>
<style lang="scss" scoped>
.wechat-receive-form {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    &-head {
        font-size: 22px;
        text-align: center;
        margin-top: 30px;
        margin-bottom: 20px;
        .subtitle {
            font-size: 14px;
        }
    }
    &-footer {
        width: 100%;
        position: absolute;
        bottom: 30px;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        p {
            padding-bottom: 2px;
            font-size: 12px;
            color: #ccc;
        }
    }
}
</style>
