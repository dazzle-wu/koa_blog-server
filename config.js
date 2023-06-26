module.exports = {
  // 加密和解密 token 的密钥
  jwtSecretKey: 'secret',
  // token 的有效期
  expiresIn: '30 days',
  // session 配置
  sessionConfig: {
    key: 'koa:sess',
    maxAge: 1000 * 60 * 60 * 30,
    autoCommit: true,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: true,
    renew: false
  }
}
