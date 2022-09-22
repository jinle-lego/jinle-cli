module.exports = {
    env: {
        commonjs: true,
        es2021: true,
        node: true,
    },
    extends: [
        'airbnb-base',
        'airbnb-typescript/base'
    ],
    overrides: [
    ],
    parserOptions: {
        project: 'tsconfig.base.json',
        ecmaVersion: 'latest',
    },
    rules: {
        // "indent": ['error', 4],
        "@typescript-eslint/indent": ['error', 4],
        'global-require': 0,
        "import/no-import-module-exports": 0,
        "import/prefer-default-export": 0,
        "consistent-return": 0,
        "max-len": ['error', 150],
        "no-unused-vars": 1, // 未使用变量
        "@typescript-eslint/no-unused-vars": 1,
        "no-unused-expressions": ['error', { "allowShortCircuit": true }], // 禁止未使用过的表达式
        "@typescript-eslint/no-unused-expressions": ['error', { "allowShortCircuit": true }], // 禁止未使用过的表达式
    },
};
