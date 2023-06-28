const router = require('@koa/router')()
const HistoryController = require('../../controller/History')

// 模块路由前缀
router.prefix('/history')

router.post('/list', HistoryController.getHistory)

router.post('/delete', HistoryController.deleteHistory)

module.exports = router
