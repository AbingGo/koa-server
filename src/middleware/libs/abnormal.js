import log from '@/logger/log'

/**
 * 日志初始化
 */
const errorLog = log.getLogger('errorLog')

const abnormal = async (ctx, next) => {
    try {
        await next()
    } catch (err) {
        const { sCode, code, message } = err

        ctx.status = sCode || 500
        errorLog.error(message)

        ctx.body = {
            errno: code,
            message,
            data: null
        }
    }
}

export default abnormal
