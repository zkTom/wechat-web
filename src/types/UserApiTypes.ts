declare namespace UserApiTypes {
    interface registerParams {
        loginName: string;
        loginPwd: string;
        nickname: string;
        captcha: string;
        timeStamp: string;
    }

    interface loginParams {
        loginName: string;
        loginPwd: string;
        captcha: string;
        timeStamp: string;
    }
}
