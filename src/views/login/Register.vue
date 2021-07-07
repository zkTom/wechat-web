<template>
    <el-form :model="form" class="register-form" label-width="0px" :rules="rules" ref="registerRuleForm">
        <el-form-item prop="loginName">
            <el-input v-model="form.loginName" auto-complete="" placeholder="输入登录用户名" tabindex="1">
                <el-button slot="prepend" icon="el-icon-user-solid"></el-button>
            </el-input>
        </el-form-item>
        <el-form-item prop="nickname">
            <el-input v-model="form.nickname" placeholder="输入用户昵称" tabindex="1">
                <el-button slot="prepend" icon="el-icon-user-solid"></el-button>
            </el-input>
        </el-form-item>
        <el-form-item prop="loginPwd" autocomplete="off">
            <el-input type="password" placeholder="输入密码" tabindex="2" v-model="form.loginPwd">
                <el-button slot="prepend" icon="el-icon-lock"></el-button>
            </el-input>
        </el-form-item>
        <el-form-item prop="secPwd">
            <el-input type="password" placeholder="再次输入密码" tabindex="3" v-model="form.secPwd">
                <el-button slot="prepend" icon="el-icon-lock"></el-button>
            </el-input>
        </el-form-item>
        <el-form-item>
            <el-input
                style="width: 160px;"
                type="text"
                placeholder="输入图形验证码"
                tabindex="4"
                v-model="form.captcha"
            >
            </el-input>
            <img class="captcha" :src="captchaBase64" width="80" height="36" />
            <a href="javascript:void(0)" class="el-icon-refresh captcha-refresh"></a>
        </el-form-item>
        <div class="register-btn">
            <el-button type="primary" @click="submit" tabindex="3">注册</el-button>
        </div>
    </el-form>
</template>
<script type="text/ecmascript-6">
import { loginPwdRule, validateLoginName } from './common';

export default {
    name: 'RegiterView',
    data() {
        return {
            registing: false,
            captchaBase64: '',
            form: {
                loginName: '',
                nickname: '',
                loginPwd: '',
                secPwd: '',
                captcha: '',
                timeStamp:''

            },
            rules: {
                loginName: [{ validator: validateLoginName, trigger: 'blur' }],
                loginPwd: loginPwdRule,
                nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
                secPwd: [{ required: true, message: '请再次输入密码', trigger: 'blur' }]
            }
        };
    },
    created() {
        this.getCaptcha();
    },
    methods: {
        async getCaptcha() {
            const res = await this.$store.dispatch('getCaptcha');
            this.captchaBase64 = res.base64;
            this.form.timeStamp = res.timeStamp;
        },
        submit() {
            let flag = false;
            this.$refs['registerRuleForm'].validate(valid => (flag = valid));
            if (!flag) return;
            const { loginName,nickname, loginPwd, secPwd, captcha, timeStamp } = this.form;
            // 两次密码匹配
            if (loginPwd !== secPwd) {
                this.$message.error("两次密码不一致");
                return;
            }
            this.$store.dispatch("register", { loginName,nickname, loginPwd, captcha, timeStamp }).then(() => {
                this.$message.success('注册成功');
                this.$emit('registerSuc');
            }).catch(err => {
                this.$message.error(err.message);
            });
        }
    }
};
</script>
<style lang="scss" scoped>
.register-form {
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
    .register-btn {
    }
    .login-btn {
        text-align: center;
    }
    .register-btn button {
        width: 100%;
        height: 36px;
        margin-bottom: 10px;
    }
}
</style>
