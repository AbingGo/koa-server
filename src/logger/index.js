import log from './log'
import clientInfo from './access'

const errorLog = log.getLogger('errorLog')
const responesLog = log.getLogger('responseLog')

/**
 * 格式化响应日志
 * @param {*} ctx
 * @param {*} resTime
 * 响应日志开始
 * 添加请求日志
 * 响应状态码
 * 响应内容
 * 响应日志结束
 */
const formatRes = (ctx, resTime) => {
    const logText = `
        ------------------------------------------------- response log start -----------------------------------------------
        ${formatReqLog(ctx, resTime)}
        response status: ${ctx.status}
        response body: ${JSON.stringify(ctx.body)}
        ------------------------------------------------- response log end -------------------------------------------------
    `

    return logText
}

/**
 * 获取请求参数
 * @param {*} method
 */
const getReqParams = (ctx) => {
    const req = ctx.request

    const clientInfoData = clientInfo(ctx, 'client info')

    const { method } = clientInfoData

    if (method === 'GET') {
        return `request query:  ${JSON.stringify(req.query)}`
    }

    return `request body:  ${JSON.stringify(req.body)}`
}

/**
 * 格式化错误日志
 * @param {*} ctx
 * @param {*} err
 * @param {*} resTime
 * 错误信息开始
 * 添加请求日志
 * 错误名称
 * 错误信息
 * 错误详情
 * 错误信息结束
 */
const formatError = (ctx, err, resTime) => {
    const logText = `
        ------------------------------------------------- error log start -----------------------------------------------
        ${formatReqLog(ctx, resTime)}
        err name: ${err.name}
        err message: ${err.message}
        err stack: ${err.stack}
        ------------------------------------------------- error log end -------------------------------------------------
    `

    return logText
}

/**
 * 格式化请求日志 req
 * @param {*} ctx
 * @param {*} resTime
 * 访问方法
 * 请求原始地址
 * 客户端ip
 * 手机还是pc
 * 请求参数
 * 服务器响应时间
 */
const formatReqLog = (ctx, resTime) => {
    const ms = new Date()
    const { start = ms, end = ms } = resTime
    const takeTime = end.getTime() - start.getTime()
    const clientInfoData = clientInfo(ctx, 'client info')
    const { ip, method, path, originUrl, userAgent } = clientInfoData

    const logText = `request start time: ${start}
        request method: ${method}
        request originUrl:  ${originUrl}
        request path:  ${path}
        request client ip:  ${ip}
        userAgent: ${userAgent}
        ${getReqParams(ctx)}
        response end time: ${end}
        response time: ${takeTime}ms`

    return logText
}

export default {
    info: (ctx, resTime) => {
        if (ctx) {
            responesLog.info(formatRes(ctx, resTime).replace(/^ {8}/gm, ''))
        }
    },
    error: (ctx, error, resTime) => {
        if (ctx && error) {
            errorLog.error(formatError(ctx, error, resTime).replace(/^ {8}/gm, ''))
        }
    }
}
