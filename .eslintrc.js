module.exports = {
    root: true,
    env: {
        node: true
    },
    globals: {},
    extends: [
        'plugin:vue/essential',
        '@vue/prettier',
        'eslint:recommended',
        '@vue/typescript',
        '@vue/prettier/@typescript-eslint'
    ],
    /**
     * rule:
     * off   0 关闭该条规则
     * warn  1 开启规则，使用警告级别的错误：warn (不会导致程序退出)
     * error 2 开启规则，使用错误级别的错误：error (当被触发的时候，程序会退出)
     */
    rules: {
        // 'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        // 'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-console': 'off',
        indent: [
            'error',
            4,
            {
                SwitchCase: 1
            }
        ], // 缩进
        'comma-dangle': [2, 'never'], // 对象最后一个key不允许带 ‘,’
        'no-var': 'error', //禁止var
        'no-unused-vars': ['warn', { vars: 'all', args: 'none', ignoreRestSiblings: false }], // 未被使用的定义变量
        eqeqeq: ['error', 'always'], // 使用 ===
        semi: ['warn', 'always'], // 语句末尾添加;
        // 'max-len': [
        //     'warn',
        //     {
        //         code: 120,
        //         ignoreUrls: true,
        //         ignoreTemplateLiterals: true // es6模版语法不换行
        //     }
        // ]
        "space-before-function-paren": 1,
        '@typescript-eslint/no-unused-vars': ['warn', { vars: 'all', args: 'none', ignoreRestSiblings: false }] // 未被使用的定义变量
    },
    parserOptions: {
        ecmaVersion: 2020,
        parser: '@typescript-eslint/parser'
    }
};
