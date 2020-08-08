import cors from 'koa2-cors'

/**
 * 判断是否允许cors跨域
 */
const corsCheck = (origin) => {
    const isCheck = /\b(xxxxx.com)\b/g.test(origin)

    return isCheck
}

export default cors({
    origin: (ctx) => {
        if (corsCheck(ctx.header.origin)) {
            return ctx.header.origin
        }

        return false
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept']
})
