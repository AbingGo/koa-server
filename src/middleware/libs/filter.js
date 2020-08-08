/**
 * 忽略一些路由
 */
const filterPath = async (ctx, next) => {

    if (ctx.request.path.indexOf('favicon.ico') >= 0) {
        return
    }

    await next()
}

export default filterPath
