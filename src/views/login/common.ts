export function validateLoginName(rule: any, value: string, callback: Function) {
    if (value.length === 0) {
        callback(new Error('请输入用户名'));
    } else if (!/^[a-zA-Z][a-zA-Z0-9_]{5,20}$/.test(value)) {
        callback(new Error('用户名只能是英文字母,数字和下划线组合'));
    } else {
        callback();
    }
}
export const loginPwdRule = (function() {
    const rule = [
        { required: true, message: '请输入密码', trigger: 'blur' },
        {
            min: 6,
            max: 20,
            message: '长度在6到20个字符',
            trigger: 'blur'
        }
    ];
    return rule;
})();
