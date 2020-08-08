import Router from 'koa-router'
import path from 'path'
import glob from 'glob'

const router = new Router()
const routerPath = path.resolve(__dirname, './libs/*.js')

/**
 * 遍历libs目录下的 js文件，并自动注册路由
 */
glob.sync(routerPath)
    .filter(file => file.endsWith('.js'))
    .forEach((file) => {
        const fileName = path.basename(file, '.js')
        const fileEntity = require(file)

        router.use(`/${fileName}`, fileEntity.routes(), fileEntity.allowedMethods())
    })

export default router
