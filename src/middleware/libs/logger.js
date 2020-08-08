import logger from '@/logger'

const accessLogger = async (ctx, next) => {
    const start = new Date()
    await next()
    const end = new Date()

    // 写入本地
    logger.info(ctx, {
        start,
        end
    })
}

export default accessLogger
