const Sequelize = require('sequelize')
const BaseController = require('./BaseController')
const CommentModel = require('../model/Comment')
const UserModel = require('../model/User')
const ArticleModel = require('../model/Article')

CommentModel.belongsTo(UserModel, { as: 'u', foreignKey: 'user_id', targetKey: 'uid' })
CommentModel.belongsTo(ArticleModel, { as: 'a', foreignKey: 'article_id', targetKey: 'aid' })

class CommentController extends BaseController {
  // 评论列表
  static async getCommentList(ctx) {
    const res = await CommentModel.findAndCountAll({
      attributes: [
        'cmid',
        'content',
        'time',
        [Sequelize.col('u.username'), 'username'],
        [Sequelize.col('a.title'), 'title']
      ],
      where: {
        article_id: ctx.request.body.id
      },
      include: [
        { model: UserModel, as: 'u', attributes: [] },
        { model: ArticleModel, as: 'a', attributes: [] }
      ],
      raw: true
    })
    ctx.body = super.renderJsonSuccess(res)
  }

  // 新增评论
  static async addComment(ctx) {
    const res = await CommentModel.create({
      content: ctx.request.body.content,
      article_id: ctx.request.body.id,
      user_id: ctx.state.user.id,
      time: new Date()
    })
    ctx.body = super.renderJsonSuccess(res)
  }

  // 删除评论
  static async deleteComment(ctx) {
    const res = await CommentModel.destroy({
      where: {
        cmid: ctx.request.body.id
      }
    })
    ctx.body = super.renderJsonSuccess()
  }
}

module.exports = CommentController
