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
        "max-len": ['error', 150]
    },
};
