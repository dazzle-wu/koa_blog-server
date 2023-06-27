const Sequelize = require('sequelize')
const path = require('path')
const BaseController = require('./BaseController')
const ArticleModel = require('../model/Article')
const CategoryModel = require('../model/Category')
const UserModel = require('../model/User')
const CommentModel = require('../model/Comment')
const LikeModel = require('../model/Like')
const { Op } = require('sequelize')

ArticleModel.belongsTo(CategoryModel, { as: 'c', foreignKey: 'category_id', targetKey: 'id' })
ArticleModel.belongsTo(UserModel, { as: 'u', foreignKey: 'user_id', targetKey: 'id' })
ArticleModel.hasMany(CommentModel)
ArticleModel.hasMany(LikeModel)

class ArticleController extends BaseController {
  // 文章列表
  static async getArticleList(ctx) {
    const res = await ArticleModel.findAndCountAll({
      attributes: [
        'id',
        'title',
        ['cover_img', 'coverImg'],
        'readings',
        ['is_publish', 'isPublish'],
        ['created_time', 'createdTime'],
        ['updated_time', 'updatedTime'],
        [Sequelize.col('c.name'), 'category'],
        [Sequelize.col('u.username'), 'user'],
        [
          Sequelize.literal(
            `(SELECT COUNT(*) FROM comment WHERE comment.article_id = article.id AND comment.is_delete = 0)`
          ),
          'comments'
        ],
        [
          Sequelize.literal(
            `(SELECT COUNT(*) FROM \`like\` WHERE \`like\`.article_id = article.id AND \`like\`.is_delete = 0)`
          ),
          'likes'
        ],
        [
          Sequelize.literal(
            `(SELECT COUNT(*) FROM \`like\` WHERE \`like\`.user_id = ${ctx.state.user.id} AND \`like\`.article_id = article.id AND \`like\`.is_delete = 0)`
          ),
          'isLike'
        ]
      ],
      where: {
        is_delete: 0,
        is_publish: ctx.request.body.state === 'all' ? [0, 1] : ctx.request.body.state === 'draft' ? 0 : 1,
        title: { [Op.like]: `%${ctx.request.body.keyword || ''}%` },
        user_id: ctx.request.body.userId ? ctx.request.body.userId : { [Op.not]: null },
        is_recommend: ctx.request.body.isRecommend ? 1 : [0, 1]
      },
      order: [['created_time', 'DESC']],
      include: [
        { model: CategoryModel, as: 'c', attributes: [] },
        { model: UserModel, as: 'u', attributes: [] }
      ],
      raw: true
    })
    ctx.body = super.renderJsonSuccess(res)
  }

  // 文章详情
  static async getArticleDetail(ctx) {
    await ArticleModel.increment({ readings: 1 }, { where: { id: ctx.params.id } })
    const res = await ArticleModel.findOne({
      attributes: [
        'id',
        'title',
        'content',
        ['cover_img', 'coverImg'],
        'readings',
        ['is_publish', 'isPublish'],
        ['created_time', 'createdTime'],
        ['updated_time', 'updatedTime'],
        [Sequelize.col('c.name'), 'category'],
        [Sequelize.col('u.username'), 'user'],
        [
          Sequelize.literal(
            `(SELECT COUNT(*) FROM comment WHERE comment.article_id = article.id AND comment.is_delete = 0)`
          ),
          'comments'
        ],
        [
          Sequelize.literal(
            `(SELECT COUNT(*) FROM \`like\` WHERE \`like\`.article_id = article.id AND \`like\`.is_delete = 0)`
          ),
          'likes'
        ],
        [
          Sequelize.literal(
            `(SELECT COUNT(*) FROM \`like\` WHERE \`like\`.user_id = ${ctx.state.user.id} AND \`like\`.article_id = article.id AND \`like\`.is_delete = 0)`
          ),
          'isLike'
        ]
      ],
      where: { id: ctx.params.id },
      include: [
        { model: CategoryModel, as: 'c', attributes: [] },
        { model: UserModel, as: 'u', attributes: [] }
      ],
      raw: true
    })
    ctx.body = super.renderJsonSuccess(res)
  }

  // 新增文章
  static async addArticle(ctx) {
    const res = await ArticleModel.create({
      ...ctx.request.body,
      cover_img: path.join('/public', ctx.file.filename),
      user_id: ctx.state.user.id
    })
    ctx.body = super.renderJsonSuccess(res)
  }

  // 更新文章
  static async updateArticle(ctx) {
    let articleInfo = ctx.request.body
    if (ctx.file) {
      articleInfo = {
        ...articleInfo,
        cover_img: path.join('/public', ctx.file.filename)
      }
    }
    const res = await ArticleModel.update(articleInfo, {
      where: { id: articleInfo.id }
    })
    ctx.body = super.renderJsonSuccess()
  }

  // 删除文章
  static async deleteArticle(ctx) {
    const res = await ArticleModel.update(
      { is_delete: 1 },
      {
        where: { id: ctx.request.body.id }
      }
    )
    ctx.body = super.renderJsonSuccess()
  }

  // 推荐文章
  static async recommendArticle(ctx) {
    const res = await ArticleModel.update(
      { is_recommend: ctx.request.body.isRecommend },
      {
        where: { id: ctx.request.body.id }
      }
    )
    ctx.body = super.renderJsonSuccess()
  }
}

module.exports = ArticleController
