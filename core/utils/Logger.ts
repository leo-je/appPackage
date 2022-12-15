import log4js from 'log4js'; // 加载log4js模块

log4js.configure({
    appenders: {
        file: { type: "file", filename: process.env.loggerFile || "logger.log" },
        console: { type: "console" }
    },
    categories: { default: { appenders: ["console"], level: "error" } },
});

// 获取默认日志
const logger = log4js.getLogger()


logger.level = process.env.loggerLevel || "info";
// logger.debug("Some debug messages");

export {
    logger
}
