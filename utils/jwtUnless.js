/**
 * 用于判断客户端当前请求接口是否需要jwt验证
 */

// 定义不需要jwt验证的接口数组
const nonTokenApiArr = ['/', '/api/article/list', '/api/category/list']

// 定义不需要jwt验证的接口正则数组
const nonTokenApiRegArr = [/^\/api\/article\/detail\/\d/]

// 判断请求api是否在数组里
const isNonTokenApi = (path) => {
  return nonTokenApiArr.includes(path)
}

// 判断请求api是否在正则数组里
const isNonTokenRegApi = (path) => {
  return nonTokenApiRegArr.some((p) => {
    return (typeof p === 'string' && p === path) || (p instanceof RegExp && !!p.exec(path))
  })
}

// 判断当前请求api是否不需要jwt验证
const checkIsNonTokenApi = (ctx) => {
  if (isNonTokenApi(ctx.path) || isNonTokenRegApi(ctx.path) || ctx.method == 'GET') {
    return true
  } else {
    // 特殊post接口，不需要验证jwt
    if (ctx.path == '/api/user/login' || ctx.path == '/api/user/register' || ctx.path == '/api/user/sendEmailCode') {
      return true
    }
    return false
  }
}

module.exports = {
  nonTokenApiArr,
  isNonTokenApi,
  checkIsNonTokenApi
}
