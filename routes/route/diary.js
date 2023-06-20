const router = require('@koa/router')()
const DiaryController = require('../../controller/Diary')

// 模块路由前缀
router.prefix('/diary')

router.get('/list', DiaryController.getDiaryList)

router.post('/add', DiaryController.addDiary)

router.post('/delete', DiaryController.deleteDiary)

module.exports = router
