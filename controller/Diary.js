const Sequelize = require('sequelize')
const BaseController = require('./BaseController')
const DiaryModel = require('../model/Diary')
const UserModel = require('../model/User')

DiaryModel.belongsTo(UserModel, { as: 'u', foreignKey: 'user_id', targetKey: 'uid' })

class DiaryController extends BaseController {
  // 列表
  static async getDiaryList(ctx) {
    const res = await DiaryModel.findAndCountAll({
      attributes: ['did', 'content', 'pub_date', [Sequelize.col('u.username'), 'username']],
      where: {
        is_delete: 0
      },
      include: [{ model: UserModel, as: 'u', attributes: [] }],
      raw: true
    })
    ctx.body = super.renderJsonSuccess(res)
  }

  // 新增
  static async addDiary(ctx) {
    const res = await DiaryModel.create({
      content: ctx.request.body.content,
      pub_date: new Date(),
      user_id: ctx.state.user.id
    })
    ctx.body = super.renderJsonSuccess(res)
  }

  // 删除
  static async deleteDiary(ctx) {
    const res = await ArticleModel.update(
      { is_delete: 1 },
      {
        where: {
          did: ctx.request.body.id
        }
      }
    )
    ctx.body = super.renderJsonSuccess()
  }
}

module.exports = DiaryController
