const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const BaseController = require('./BaseController')
const UserModel = require('../model/User')
const config = require('../config.js')
const { Op } = require('sequelize')

class UserController extends BaseController {
  // 用户列表
  static async getUserList(ctx) {
    const res = await UserModel.findAll({
      attributes: ['uid', 'email', 'username', 'role', 'state']
    })
    ctx.body = super.renderJsonSuccess(res)
  }

  // 用户详情
  static async getUserDetail(ctx) {
    const res = await UserModel.findOne({
      attributes: ['uid', 'email', 'username'],
      where: {
        uid: ctx.request.body.id
      }
    })
    ctx.body = super.renderJsonSuccess(res)
  }

  // 用户注册
  static async register(ctx) {
    const { email, password } = ctx.request.body
    const user = await UserModel.findOne({
      where: {
        email: email
      }
    })
    if (!user) {
      const res = await UserModel.create({
        email: email,
        password: bcrypt.hashSync(password, 10)
      })
      ctx.body = super.renderJsonSuccess(res)
    } else {
      ctx.body = super.renderJsonError('邮箱已被使用')
    }
  }

  // 用户登录
  static async login(ctx) {
    const { username, password } = ctx.request.body
    const user = await UserModel.findOne({
      attributes: ['uid', 'email', 'username', 'password'],
      where: {
        [Op.and]: [{ [Op.or]: [{ email: username }, { username: username }] }, { state: 0 }]
      }
    })
    if (user) {
      const compareResult = bcrypt.compareSync(password, user.password)
      if (compareResult) {
        const tokenStr = jwt.sign({ id: user.uid }, config.jwtSecretKey, { expiresIn: config.expiresIn })
        const data = {
          ...user.dataValues,
          token: 'Bearer ' + tokenStr
        }
        ctx.body = super.renderJsonSuccess(data)
      } else {
        ctx.body = super.renderJsonError('密码错误')
      }
    } else {
      ctx.body = super.renderJsonError('用户不存在')
    }
  }

  // 修改密码
  static async changePassword(ctx) {
    const { oldPassword, newPassword } = ctx.request.body
    const user = await UserModel.findOne({
      where: {
        uid: ctx.state.user.id
      }
    })
    const compareResult = bcrypt.compareSync(oldPassword, user.password)
    if (compareResult) {
      if (newPassword !== oldPassword) {
        const res = await UserModel.update(
          { password: bcrypt.hashSync(newPassword, 10) },
          {
            where: { uid: ctx.state.user.id }
          }
        )
        ctx.body = super.renderJsonSuccess()
      } else {
        ctx.body = super.renderJsonError('新密码不能与原密码相同')
      }
    } else {
      ctx.body = super.renderJsonError('原密码错误')
    }
  }

  // 修改昵称
  static async changeUsername(ctx) {
    const { username } = ctx.request.body
    const user = await UserModel.findOne({
      where: { username: username }
    })
    if (!user) {
      const res = await UserModel.update(
        { username: username },
        {
          where: { uid: ctx.state.user.id }
        }
      )
      ctx.body = super.renderJsonSuccess()
    } else {
      if (username === user.username) {
        ctx.body = super.renderJsonError('请输入新昵称')
      } else {
        ctx.body = super.renderJsonError('昵称已被使用')
      }
    }
  }
}

module.exports = UserController
