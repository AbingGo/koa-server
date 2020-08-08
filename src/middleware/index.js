import compose from 'koa-compose'
import cors from './libs/cors'
import filter from './libs/filter'
import login from './libs/login'
import authority from './libs/authority'
import logger from './libs/logger'
import abnormal from './libs/abnormal'
import responseFormatter from './libs/response'

const middleware = () => {
    return compose([

        // cors
        cors,

        // 过滤
        filter,

        // 日志
        logger,

        // 异常处理
        abnormal,

        // 登录验证
        login,

        // 权限校验
        authority,

        // 响应处理
        responseFormatter
    ])
}

export default middleware
