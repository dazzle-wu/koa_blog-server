const path = require('path')
const router = require('@koa/router')()
const context = require('../utils/autoLoadFile')

/**
 * @param {Array} arr 需要注册路由的文件列表
 */
function importAll(arr) {
  arr.forEach((key) => {
    // 这种方式为嵌套路由
    router.use('/api', key.data.routes(), key.data.allowedMethods())
  })
}
importAll(context(path.join(__dirname, './route'), false))

module.exports = router
