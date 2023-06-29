const { Sequelize, Op } = require('sequelize')
const BaseController = require('./BaseController')
const CollectModel = require('../model/Collect')
const UserModel = require('../model/User')
const ArticleModel = require('../model/Article')

CollectModel.belongsTo(UserModel, { as: 'u', foreignKey: 'user_id', targetKey: 'id' })
CollectModel.belongsTo(ArticleModel, { as: 'a', foreignKey: 'article_id', targetKey: 'id' })

class CollectController extends BaseController {
  // 查看收藏
  static async getCollect(ctx) {
    const { keyword = '' } = ctx.request.body
    const res = await CollectModel.findAndCountAll({
      attributes: [
        'id',
        [Sequelize.col('a.title'), 'title'],
        [Sequelize.col('a.cover_img'), 'coverImg'],
        [Sequelize.col('u.avatar'), 'avatar'],
        [Sequelize.col('u.email'), 'email'],
        [Sequelize.col('u.username'), 'username']
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

  // 收藏文章
  static async collectArticle(ctx) {
    const record = await CollectModel.findOne({
      attributes: ['id'],
      where: {
        article_id: ctx.request.body.id,
        user_id: ctx.state.user.id
      }
    })
    if (record) {
      const res = await CollectModel.update(
        { is_delete: 0 },
        {
          where: {
            article_id: ctx.request.body.id,
            user_id: ctx.state.user.id
          }
        }
      )
      ctx.body = super.renderJsonSuccess()
    } else {
      const res = await CollectModel.create({
        article_id: ctx.request.body.id,
        user_id: ctx.state.user.id
      })
      ctx.body = super.renderJsonSuccess(res)
    }
  }

  // 取消收藏文章
  static async cancelCollectArticle(ctx) {
    const res = await CollectModel.update(
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

module.exports = CollectController
