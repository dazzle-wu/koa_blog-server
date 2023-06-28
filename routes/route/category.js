const router = require('@koa/router')()
const CategoryController = require('../../controller/Category')

// 模块路由前缀
router.prefix('/category')

router.post('/list', CategoryController.getCategoryList)

router.post('/add', CategoryController.addCategory)

router.post('/update', CategoryController.updateCategory)

router.post('/delete', CategoryController.deleteCategory)

module.exports = router
