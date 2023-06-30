const path = require('path')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const svgCaptcha = require('svg-captcha')
const nodemailer = require('nodemailer')
const { Sequelize, Op } = require('sequelize')
const BaseController = require('./BaseController')
const UserModel = require('../model/User')
const config = require('../config.js')

class UserController extends BaseController {
  // 用户列表
  static async getUserList(ctx) {
    const res = await UserModel.findAll()
    ctx.body = super.renderJsonSuccess(res)
  }

  // 用户详情
  static async getUserDetail(ctx) {
    const { id } = ctx.request.body
    const res = await UserModel.findOne({
      attributes: [
        'id',
        'avatar',
        'email',
        'username',
        [
          Sequelize.literal(
            `(SELECT COUNT(*) FROM \`like\` WHERE \`like\`.user_id = ${id} AND \`like\`.is_delete = 0)`
          ),
          'likes'
        ],
        [
          Sequelize.literal(
            `(SELECT COUNT(*) FROM collect WHERE collect.user_id = ${id} AND collect.is_delete = 0)`
          ),
          'collects'
        ],
        ['is_admin', 'isAdmin'],
        ['created_time', 'createdTime']
      ],
      where: { id: id }
    })
    ctx.body = super.renderJsonSuccess(res)
  }

  // 用户注册
  static async register(ctx) {
    const { email, emailCode, password } = ctx.request.body
    if (emailCode === ctx.session.emailCode) {
      const user = await UserModel.findOne({
        where: { email: email }
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
    } else {
      ctx.body = super.renderJsonError('邮箱验证码错误')
    }
  }

  // 用户登录
  static async login(ctx) {
    const { username, password, captcha } = ctx.request.body
    if (captcha.toLowerCase() === ctx.session.captcha) {
      const user = await UserModel.findOne({
        attributes: ['id', 'email', 'username', 'password'],
        where: {
          [Op.or]: [{ email: username }, { username: username }],
          is_delete: 0
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
    } else {
      ctx.body = super.renderJsonError('验证码错误')
    }
  }

  // 修改头像
  static async changeAvatar(ctx) {
    const res = UserModel.update(
      { avatar: path.join('/public', ctx.file.filename) },
      {
        where: { id: ctx.state.user.id }
      }
    )
    ctx.body = super.renderJsonSuccess()
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
          where: { id: ctx.state.user.id }
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

  // 修改密码
  static async changePassword(ctx) {
    const { oldPassword, newPassword } = ctx.request.body
    const user = await UserModel.findOne({
      where: { id: ctx.state.user.id }
    })
    const compareResult = bcrypt.compareSync(oldPassword, user.password)
    if (compareResult) {
      if (newPassword !== oldPassword) {
        const res = await UserModel.update(
          { password: bcrypt.hashSync(newPassword, 10) },
          {
            where: { id: ctx.state.user.id }
          }
        )
        ctx.body = super.renderJsonSuccess('密码修改成功')
      } else {
        ctx.body = super.renderJsonError('新密码不能与原密码相同')
      }
    } else {
      ctx.body = super.renderJsonError('原密码错误')
    }
  }

  // 找回密码
  static async recoverPassword(ctx) {
    const { email, emailCode, password } = ctx.request.body
    if (emailCode === ctx.session.emailCode) {
      const res = await UserModel.update(
        { password: bcrypt.hashSync(password, 10) },
        {
          where: { email: email }
        }
      )
      ctx.body = super.renderJsonSuccess('密码重置成功')
    } else {
      ctx.body = super.renderJsonError('邮箱验证码错误')
    }
  }

  // 获取验证码
  static async getCaptcha(ctx) {
    const captcha = svgCaptcha.create({
      inverse: false,
      fontSize: 48,
      noise: 2,
      width: 100,
      height: 40,
      size: 4,
      ignoreChars: '0o1i'
    })
    ctx.session.captcha = captcha.text.toLowerCase()
    ctx.set('Content-Type', 'image/svg+xml')
    ctx.body = captcha.data
  }

  // 发送邮箱验证码
  static async sendEmailCode(ctx) {
    const { email, type } = ctx.request.body
    const code = Math.random().toString().slice(2, 6)
    ctx.session.emailCode = code
    const mailOptions = {
      from: config.userEmail,
      to: email,
      subject: '验证码',
      html: `<div>您正在${type === 'register' ? '注册' : '找回密码'}，验证码为：<span>${code}</span></div>`
    }
    const transporter = nodemailer.createTransport(config.emailConfig)
    try {
      await transporter.sendMail(mailOptions)
      ctx.body = super.renderJsonSuccess('邮箱验证码发送成功')
    } catch (e) {
      ctx.body = super.renderJsonError('邮箱验证码发送失败')
    }
  }
}

module.exports = UserController
