const Koa = require('koa')
const app = new Koa()

const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const static = require('koa-static')
const logger = require('koa-logger')
const cors = require('koa-cors')
const jwt = require('koa-jwt')
const session = require('koa-session')
const router = require('./routes/index')
const config = require('./config.js')

const handler = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500
    ctx.body = {
      code: ctx.status,
      msg: err.message
    }
  }
}

onerror(app)

app.use(handler)

app.keys = ['secret']

app.use(session(config.sessionConfig, app))

app.use(bodyparser())

app.use(logger())

app.use(static(__dirname + '/public'))

app.use(cors())

app.use(
  jwt({ secret: config.jwtSecretKey }).unless({
    path: ['/api/user/register', '/api/user/login', '/api/user/getCaptcha', '/api/user/sendEmailCode']
  })
)

app.use(router.routes(), router.allowedMethods())

app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

app.listen(3000, () => {
  console.log('server running at: http://localhost:3000')
})
