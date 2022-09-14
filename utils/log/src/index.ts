import log from 'npmlog';

export const updateLogLevel = () => {
    log.level = process.env?.LOG_LEVEL || 'info'; // 判断debug模式
};

updateLogLevel();

log.heading = '🤖'; // 修改前缀

log.addLevel('success', 2000, { fg: 'green', bold: true }); // 添加自定义命令

export default log;
