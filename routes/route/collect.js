const router = require('@koa/router')()
const CollectController = require('../../controller/Collect')

// 模块路由前缀
router.prefix('/collect')

router.post('/list', CollectController.getCollect)

router.post('/add', CollectController.collectArticle)

router.post('/cancel', CollectController.cancelCollectArticle)

module.exports = router
