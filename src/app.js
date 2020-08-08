import Koa from 'koa'
import http from 'http'
import path from 'path'
import koaBody from 'koa-body'
import koaStatic from 'koa-static'
import router from '@/router'
import middleware from '@/middleware'
import serverConf from '@/config/server'

/**
 * 实例化koa
 */
const app = new Koa()

/**
 * 中间件注入
 */
app

    // body解析
    .use(koaBody({
        multipart: true,
        formLimit: '20mb',
        jsonLimit: '20mb',
        textLimit: '20mb'
    }))

    // static
    .use(koaStatic(
        path.resolve(__dirname, './static')
    ))

    // 业务自定义中间件注入
    .use(middleware())

    // 路由
    .use(router.routes())

    // 响应头
    .use(router.allowedMethods())

/**
 * create server
 */
const server = http.createServer(app.callback())

/**
 * 监听服务
 */
server.listen(serverConf.PORT, serverConf.HOST, () => {
    console.log(`${serverConf.DESC} ${serverConf.PORT}`)
})
