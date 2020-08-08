import Router from 'koa-router'
import controller from '@/controller/hello'
const router = new Router()

router.get('/getList', controller.getList)

module.exports = router
