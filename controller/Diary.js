const Sequelize = require('sequelize')
const BaseController = require('./BaseController')
const DiaryModel = require('../model/Diary')
const UserModel = require('../model/User')

DiaryModel.belongsTo(UserModel, { as: 'u', foreignKey: 'user_id', targetKey: 'id' })

class DiaryController extends BaseController {
  // 日记列表
  static async getDiaryList(ctx) {
    const res = await DiaryModel.findAndCountAll({
      attributes: ['id', 'content', 'created_time', [Sequelize.col('u.username'), 'user']],
      where: {
        user_id: ctx.state.user.id,
        is_delete: 0
      },
      order: [['created_time', 'DESC']],
      include: [{ model: UserModel, as: 'u', attributes: [] }],
      raw: true
    })
    ctx.body = super.renderJsonSuccess(res)
  }

  // 新增日记
  static async addDiary(ctx) {
    const res = await DiaryModel.create({
      content: ctx.request.body.content,
      user_id: ctx.state.user.id
    })
    ctx.body = super.renderJsonSuccess(res)
  }

  // 删除日记
  static async deleteDiary(ctx) {
    const res = await ArticleModel.update(
      { is_delete: 1 },
      {
        where: { id: ctx.request.body.id }
      }
    )
    ctx.body = super.renderJsonSuccess()
  }
}

module.exports = DiaryController
