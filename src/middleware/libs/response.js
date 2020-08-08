import CODES from '@/config/codes'

/**
 * 涉及到sql的参数合法性校验正则
 */
const checkRegs = {
    id: /^[-_A-Za-z0-9]*$/
}

/**
 * 对提交过来的参数进行校验
 * 如果不在checkRegs中，直接返回true
 */
const check = (ctx) => {
    const { query } = ctx.request
    const keys = Object.keys(query)
    const rel = keys.every((key) => {
        return !checkRegs[key] || checkRegs[key].test(query[key])
    })

    return rel
}

/**
 * 对响应做统一处理，
 * 添加errno、message
 * @param {*} ctx
 * @param {*} next
 */
const responseFormatter = async (ctx, next) => {

    if (!check(ctx)) {

        ctx.body = CODES['illegal']

        return
    }

    // 先去执行路由
    await next()

    // 合法的响应，一定要带ctx.body
    if (ctx.body === null || ctx.body === undefined) {
        return
    }

    // 如果是业务异常返回
    if (ctx.body.errno) {
        return
    }

    // 如果有返回数据，将返回数据添加到data中
    ctx.body = {
        errno: 0,
        message: 'success',
        data: ctx.body
    }
}

export default responseFormatter
