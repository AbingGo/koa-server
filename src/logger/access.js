/**
 * @param {*} req ctx.req
 * @method 获取客户端ip地址
 */
const getClientIp = (req) => {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress
}

const clientInfo = (ctx, message) => {
    const client = {
        ip: getClientIp(ctx.req),
        method: ctx.request.method,
        path: ctx.request.path,
        originUrl: ctx.request.headers['host'],
        referer: ctx.request.headers['referer'],
        userAgent: ctx.request.headers['user-agent'],
        message: message,
        cookie: ctx.request.headers['cookie']
    }

    // 返回客户端信息交给logger打印
    return client
}

export default clientInfo
