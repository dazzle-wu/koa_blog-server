const router = require('@koa/router')()
const CommentController = require('../../controller/Comment')
const LikeController = require('../../controller/Like')

// 模块路由前缀
router.prefix('/comment')

router.post('/list', CommentController.getCommentList)

router.post('/add', CommentController.addComment)

router.post('/delete', CommentController.deleteComment)

router.post('/like', LikeController.likeComment)

router.post('/cancelLike', LikeController.cancelLikeComment)

module.exports = router
