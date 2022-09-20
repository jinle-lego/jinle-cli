# 常用命令
```bash
// 根目录安装
yarn add typescript -W -D

// 对应包安装依赖
yarn workspace @jinle-cli/cli add lodash

// 对应包安装本地包
yarn workspace @jinle-cli/cli add @jinle-cli/log@1.0.0

// 查看相关包依赖
yarn workspaces info

// 提交commit
yarn commit

// 发布包
yarn run publish
```

# 环境变量
```js
CLI_HOME // cli默认文件夹
CLI_HOME_PATH // cli默认文件夹路径
CLI_TARGET_PATH // 本地文件调试路径
LOG_LEVEL // log等级
```