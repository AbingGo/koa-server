import fs from 'fs'
import path from 'path'
import log4js from 'log4js'
import { mkDirs } from '@/utils'

/**
 * 判断文件目录是否存在，如果不存在，新建日志文件
 * @param {*} pathStr
 */
const confirmPath = async (pathStr) => {
    await mkDirs(path.join(__dirname, '../../logs'))
    if (!fs.existsSync(pathStr)) {
        fs.mkdirSync(pathStr)
        console.log('createPath: ' + pathStr)
    }
}

/**
 * 日志文件目录配置
 * 如果要新加，配置即可
 */
const loggerConf = {
    error: {
        path: path.resolve(__dirname, '../../logs/errors/'),
        categories: {
            appenders: ['error'],
            level: 'error'
        }
    },
    success: {
        path: path.resolve(__dirname, '../../logs/successes/'),
        categories: {
            appenders: ['success'],
            level: 'info'
        }
    },
    response: {
        path: path.resolve(__dirname, '../../logs/responses/'),
        categories: {
            appenders: ['response'],
            level: 'info'
        }
    },
    database: {
        path: path.resolve(__dirname, '../../logs/databases/'),
        categories: {
            appenders: ['database'],
            level: 'info'
        }
    },
    redis: {
        path: path.resolve(__dirname, '../../logs/redises/'),
        categories: {
            appenders: ['redis'],
            level: 'info'
        }
    },
    cluster: {
        path: path.resolve(__dirname, '../../logs/clusters/'),
        categories: {
            appenders: ['cluster'],
            level: 'info'
        }
    },
    other: {
        path: path.resolve(__dirname, '../../logs/others/'),
        categories: {
            appenders: ['other'],
            level: 'info'
        }
    },
    crontab: {
        path: path.resolve(__dirname, '../../logs/crontabs/'),
        categories: {
            appenders: ['crontab'],
            level: 'info'
        }
    }
}

const loggerAppenders = {
    stdout: {
        type: 'stdout'
    }
}
const loggerCategories = {
    default: {
        appenders: ['stdout'],
        level: 'debug'
    }
}

/**
 * 如果日志文件目录不存在，则新建目录
 */
Object.keys(loggerConf).forEach(logger => {
    const conf = loggerConf[logger]
    const { path, categories } = conf

    // 判断目录是否存在，如果不存在，则会创建
    confirmPath(path)

    loggerAppenders[logger] = {
        category: `${logger}Log`, // logger名称
        type: 'dateFile', // 日志类型
        filename: `${path}/${logger}`, // 日志输出位置
        alwaysIncludePattern: true, // 是否总是有后缀名
        pattern: 'yyyy-MM-dd.log' // 后缀，每天创建一个新的日志文件
    }

    loggerCategories[`${logger}Log`] = categories
})

/**
 * 日志配置
 */
log4js.configure({
    appenders: loggerAppenders,
    categories: loggerCategories,
    replaceConsole: true
})

export default log4js
