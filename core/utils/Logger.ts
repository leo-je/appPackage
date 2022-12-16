import log4js from 'log4js'; // 加载log4js模块

let appName = process.env.appName || 'app'

let appenders = {
}
let categoriesAppenders = [appName]
// 1.控制台
appenders[appName] = { type: "console" }

// 2.文件
let isUseLogFile = process.env.useLogFile || true
if (isUseLogFile) {
    let filename = process.env.logFilePath || "logger.log"
    appenders['file'] = { type: "file", filename }
    categoriesAppenders.push['file']
}


let categories = { default: { appenders: categoriesAppenders, level: "error" } }

log4js.configure({
    appenders,
    categories,
});

// 获取默认日志
const logger = log4js.getLogger(appName)
logger.level = process.env.loggerLevel || "info";
// logger.debug("Some debug messages");
export {
    logger
}
