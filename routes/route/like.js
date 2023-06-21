const router = require('@koa/router')()
const LikeController = require('../../controller/Like')

// 模块路由前缀
router.prefix('/like')

router.post('/', LikeController.like)

router.post('/cancel', LikeController.cancelLike)

module.exports = router
