const path = require('path')
const router = require('@koa/router')()
const multer = require('@koa/multer')
const UserController = require('../../controller/User')

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
router.prefix('/user')

router.post('/list', UserController.getUserList)

router.post('/detail', UserController.getUserDetail)

router.post('/register', UserController.register)

router.post('/login', UserController.login)

router.post('/changePassword', UserController.changePassword)

router.post('/changeUsername', UserController.changeUsername)

router.post('/changeAvatar', upload.single('avatar'), UserController.changeAvatar)

router.get('/getCaptcha', UserController.getCaptcha)

router.post('/sendEmailCode', UserController.sendEmailCode)

module.exports = router
