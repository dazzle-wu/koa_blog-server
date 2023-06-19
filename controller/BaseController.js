class BaseController {
  static renderJsonSuccess(data = null, code = 200) {
    const _data = {
      code
    }
    if (typeof data === 'object') {
      _data.msg = 'success'
      _data.data = data
    } else {
      _data.msg = data
    }
    return _data
  }
  static renderJsonError(err = null, code = 500) {
    const _data = {
      code
    }
    if (typeof err === 'object') {
      _data.msg = 'error'
      _data.data = JSON.stringify(err)
    } else {
      _data.msg = err
    }
    return _data
  }
}

module.exports = BaseController
