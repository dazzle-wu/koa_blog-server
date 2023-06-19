const path = require('path')
const router = require('@koa/router')()
const multer = require('@koa/multer')
const ArticleController = require('../../controller/Article')

const storage = multer.diskStorage({
  destination: function (ctx, file, cb) {
    cb(null, path.join(__dirname, '../../public'))
  },
  filename: function (ctx, file, cb) {
    const filenameArr = file.originalname.split('.')
    cb(null, Date.now() + '.' + filenameArr.pop())
  }
})
const upload = multer({ storage })

// 模块路由前缀
router.prefix('/article')

router.get('/list', ArticleController.getArticleList)

router.get('/detail/:id', ArticleController.getArticleDetail)

router.post('/add', upload.single('cover_img'), ArticleController.addArticle)

module.exports = router