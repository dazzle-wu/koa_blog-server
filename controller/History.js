const { Sequelize, Op } = require('sequelize')
const BaseController = require('./BaseController')
const HistoryModel = require('../model/History')
const UserModel = require('../model/User')
const ArticleModel = require('../model/Article')

HistoryModel.belongsTo(UserModel, { as: 'u', foreignKey: 'user_id', targetKey: 'id' })
HistoryModel.belongsTo(ArticleModel, { as: 'a', foreignKey: 'article_id', targetKey: 'id' })

class HistoryController extends BaseController {
  // 查看历史
  static async getHistory(ctx) {
    const { keyword = '' } = ctx.request.body
    const res = await HistoryModel.findAndCountAll({
      attributes: [
        'id',
        [Sequelize.col('a.title'), 'title'],
        [Sequelize.col('a.cover_img'), 'coverImg'],
        [Sequelize.col('u.avatar'), 'avatar'],
        [Sequelize.col('u.email'), 'email'],
        [Sequelize.col('u.username'), 'username'],
        ['updated_time', 'time']
      ],
      where: {
        user_id: ctx.state.user.id,
        is_delete: 0
      },
      order: [['updated_time', 'DESC']],
      include: [
        { model: UserModel, as: 'u', attributes: [] },
        {
          model: ArticleModel,
          as: 'a',
          attributes: [],
          where: {
            title: { [Op.like]: `%${keyword}%` }
          }
        }
      ],
      raw: true
    })
    ctx.body = super.renderJsonSuccess(res)
  }

  // 新增历史
  static async addHistory(ctx) {
    const { userId = 0 } = ctx.request.body
    if (parseInt(userId)) {
      const record = await HistoryModel.findOne({
        attributes: ['id'],
        where: {
          article_id: ctx.params.id,
          user_id: userId
        }
      })
      if (record) {
        await HistoryModel.update(
          {
            is_delete: 0,
            updated_time: new Date()
          },
          {
            where: {
              article_id: ctx.params.id,
              user_id: userId
            }
          }
        )
      } else {
        await HistoryModel.create({
          article_id: ctx.params.id,
          user_id: userId
        })
      }
    }
  }

  // 删除历史
  static async deleteHistory(ctx) {
    const res = await HistoryModel.update(
      { is_delete: 1 },
      {
        where: {
          article_id: ctx.request.body.id,
          user_id: ctx.state.user.id
        }
      }
    )
    ctx.body = super.renderJsonSuccess()
  }
}

module.exports = HistoryController
