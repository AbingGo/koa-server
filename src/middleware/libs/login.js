import CODES from '@/config/codes'
import router from '@/config/router'

/**
 * 登录校验
 */
const leedCheckLogin = (ctx) => {
    const rel = router.UN_CHECK_ROUTER_LIST.every((item) => {
        return ctx.request.url.indexOf(item) < 0
    })

    return rel
}

/**
 * 坚权
 * @param {*} ctx
 * @param {*} token
 */
const isCheckLogin = (ctx, token) => {
    return true
}

const isLogin = (ctx) => {
    const pcgToken = 'xxxxxxxxxxxxxx'

    return isCheckLogin(ctx, pcgToken)
}

const login = async (ctx, next) => {

    if (!isLogin(ctx) && leedCheckLogin(ctx)) {

        ctx.body = CODES['login']

        return
    }
    await next()
}

export default login
