/**
 * 主页子路由
 */
import Router from 'koa-router'
import controller from '@/controller/home'

const router = new Router()

router.get('/', controller)

module.exports = router
