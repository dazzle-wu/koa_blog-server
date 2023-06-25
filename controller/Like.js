const BaseController = require('./BaseController')
const LikeModel = require('../model/Like')

class LikeController extends BaseController {
  // 点赞文章
  static async likeArticle(ctx) {
    const record = await LikeModel.findOne({
      attributes: ['id'],
      where: {
        article_id: ctx.request.body.id,
        user_id: ctx.state.user.id
      }
    })
    if (record) {
      const res = await LikeModel.update(
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
      const res = await LikeModel.create({
        article_id: ctx.request.body.id,
        user_id: ctx.state.user.id
      })
      ctx.body = super.renderJsonSuccess(res)
    }
  }

  // 取消点赞文章
  static async cancelLikeArticle(ctx) {
    const res = await LikeModel.update(
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

  // 点赞评论
  static async likeComment(ctx) {
    const record = await LikeModel.findOne({
      attributes: ['id'],
      where: {
        comment_id: ctx.request.body.id,
        user_id: ctx.state.user.id
      }
    })
    if (record) {
      const res = await LikeModel.update(
        { is_delete: 0 },
        {
          where: {
            comment_id: ctx.request.body.id,
            user_id: ctx.state.user.id
          }
        }
      )
      ctx.body = super.renderJsonSuccess()
    } else {
      const res = await LikeModel.create({
        comment_id: ctx.request.body.id,
        user_id: ctx.state.user.id
      })
      ctx.body = super.renderJsonSuccess(res)
    }
  }

  // 取消点赞评论
  static async cancelLikeComment(ctx) {
    const res = await LikeModel.update(
      { is_delete: 1 },
      {
        where: {
          comment_id: ctx.request.body.id,
          user_id: ctx.state.user.id
        }
      }
    )
    ctx.body = super.renderJsonSuccess()
  }
}

module.exports = LikeController
