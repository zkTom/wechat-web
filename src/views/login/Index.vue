<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-header clearfix">
                <div class="ms-title">鱼小宝</div>
                <div class="ms-action" @click="toggleView">{{ loginViewShow ? '注册' : '返回登录' }}</div>
            </div>
            <div class="ms-body">
                <p class="ms-subtitle">{{ loginViewShow ? '账号登录' : '账号注册' }}</p>
                <el-form
                    :model="ruleForm"
                    :rules="rules"
                    ref="ruleForm"
                    label-width="0px"
                    class="ms-content"
                    v-if="loginViewShow"
                >
                    <el-form-item prop="loginName">
                        <el-input v-model="ruleForm.loginName" placeholder="输入用户名" tabindex="1">
                            <el-button slot="prepend" icon="el-icon-user-solid"></el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="loginPwd">
                        <el-input
                            type="password"
                            placeholder="输入密码"
                            tabindex="2"
                            v-model="ruleForm.loginPwd"
                            @keyup.enter.native="submit"
                        >
                            <el-button slot="prepend" icon="el-icon-lock"></el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input
                            style="width: 160px;"
                            type="text"
                            placeholder="输入图形验证码"
                            tabindex="3"
                            v-model="ruleForm.captcha"
                            @keyup.enter.native="submit"
                        >
                        </el-input>
                        <img class="captcha" :src="captchaBase64" width="80" height="36" />
                        <a href="javascript:void(0)" class="el-icon-refresh captcha-refresh" @click="getCaptcha" />
                    </el-form-item>
                    <p class="ms-agreement">登录即表示您已同意<a href="javascript:void(0);">《服务条款》</a></p>
                    <div class="login-btn">
                        <el-button type="primary" @click="submitWrapper" tabindex="3">{{
                            logining ? '登录中...' : '登录'
                        }}</el-button>
                    </div>
                </el-form>
                <Register @registerSuc="toggleView" v-else />
            </div>
        </div>
    </div>
</template>

<script>
import { debounce } from 'lodash';
import db from '@/utils/localStorage.ts';
import Register from './Register.vue';
import { loginPwdRule, validateLoginName } from './common';
export default {
    components: {
        Register
    },
    data: function() {
        const username = db.get('__username__', '');
        return {
            loginViewShow: true,
            logining: false,
            captchaBase64: '',
            ruleForm: {
                loginName: username,
                loginPwd: '',
                captcha: '',
                timeStamp: ''
            },
            rules: {
                loginName: [{ validator: validateLoginName, trigger: 'blur' }],
                loginPwd: loginPwdRule
            }
        };
    },
    created() {
        this.getCaptcha();
    },
    methods: {
        toggleView() {
            this.loginViewShow = !this.loginViewShow;
        },
        async getCaptcha() {
            const res = await this.$store.dispatch('getCaptcha');
            this.captchaBase64 = res.base64;
            this.ruleForm.timeStamp = res.timeStamp;
        },
        // 必须包裹函数，且包裹函数不能使用arrow fn
        submitWrapper: debounce(function() {
            this.submit();
        }, 250),
        submit() {
            let flag = false;
            this.$refs['ruleForm'].validate(valid => (flag = valid));
            if (!flag) return;

            this.logining = true;
            this.$store
                .dispatch('login', this.ruleForm)
                .then(() => {
                    this.$message.success('登录成功');
                    this.$router.push({ path: '/index' });
                })
                .catch(err => {
                    this.$message.error(err.message);
                })
                .finally(() => {
                    this.logining = false;
                });
        }
    }
};
</script>

<style lang="scss" scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #f5f5f5;
}
.ms-login {
    background: #fff;
    border: 1px solid #eee;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: column;

    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 600px;
    padding-bottom: 100px;
}
.ms-header {
    width: 100%;
    height: 50px;
    position: relative;
    line-height: 50px;
    padding: 0 40px;
    margin: 30px 0;
    .ms-title {
        font-size: 16px;
        color: #333333;
        float: left;
        user-select: none;
    }
    .ms-action {
        cursor: pointer;
        font-size: 16px;
        color: #3b74ff;
        float: right;
    }
}
.ms-body {
    width: 400px;
    padding: 0 30px;
    margin-top: 20px;

    .ms-subtitle {
        font-size: 18px;
        line-height: 24px;
        text-align: center;
        padding-bottom: 30px;
    }
    .ms-content {
    }
    .ms-agreement {
        font-size: 14px;
        margin-bottom: 15px;
        text-align: left;

        a {
            color: #09c;
        }
    }
    .captcha {
        line-height: 36px;
        margin: 0 20px;
        user-select: none;
    }
    .captcha-refresh {
        display: inline-block;
        line-height: 36px;
        font-size: 20px;
        vertical-align: text-top;
    }
}

.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
</style>
