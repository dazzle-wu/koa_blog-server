const router = require('@koa/router')()
const CommentController = require('../../controller/Comment')

// 模块路由前缀
router.prefix('/comment')

router.post('/list', CommentController.getCommentList)

router.post('/add', CommentController.addComment)

router.post('/delete', CommentController.deleteComment)

module.exports = router
