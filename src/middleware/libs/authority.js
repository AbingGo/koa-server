import users from '@/commons/users'
import router from '@/config/router'
import CODES from '@/config/codes'

/**
 * 权限校验
 */
const needCheck = (ctx) => {
    const rel = router.UN_CHECK_ROUTER_LIST.some((item) => {

        const reg = new RegExp(`\\b(${item})\\b`)

        return reg.test(ctx.request.url)
    })

    return !rel
}

const authority = async (ctx, next) => {
    const isUser = await users.isUser(ctx)

    // 如果需要检验 && 不是普通用户
    if (needCheck(ctx) && !isUser) {

        ctx.body = CODES.authority

        return
    }

    await next()
}

export default authority
