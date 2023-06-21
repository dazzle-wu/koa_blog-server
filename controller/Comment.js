const Sequelize = require('sequelize')
const BaseController = require('./BaseController')
const CommentModel = require('../model/Comment')
const UserModel = require('../model/User')
const ArticleModel = require('../model/Article')

CommentModel.belongsTo(UserModel, { as: 'u', foreignKey: 'user_id', targetKey: 'id' })
CommentModel.belongsTo(ArticleModel, { as: 'a', foreignKey: 'article_id', targetKey: 'id' })

class CommentController extends BaseController {
  // 评论列表
  static async getCommentList(ctx) {
    const res = await CommentModel.findAndCountAll({
      attributes: [
        'id',
        'content',
        'created_time',
        [Sequelize.col('u.username'), 'user'],
        [Sequelize.col('a.title'), 'article']
      ],
      where: {
        article_id: ctx.request.body.id,
        is_delete: 0
      },
      order: [['created_time', 'DESC']],
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
      user_id: ctx.state.user.id
    })
    ctx.body = super.renderJsonSuccess(res)
  }

  // 删除评论
  static async deleteComment(ctx) {
    const res = await CommentModel.update(
      { is_delete: 1 },
      {
        where: { id: ctx.request.body.id }
      }
    )
    ctx.body = super.renderJsonSuccess()
  }
}

module.exports = CommentController
