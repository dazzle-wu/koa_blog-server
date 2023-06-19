const router = require('@koa/router')()
const UserController = require('../../controller/User')
// 模块路由前缀
router.prefix('/user')

router.post('/list', UserController.getUserList)

router.post('/detail', UserController.getUserDetail)

router.post('/register', UserController.register)

router.post('/login', UserController.login)

router.post('/changePassword', UserController.changePassword)

router.post('/changeUsername', UserController.changeUsername)

module.exports = router
