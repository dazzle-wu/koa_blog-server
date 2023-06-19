const Sequelize = require('sequelize')
const path = require('path')
const BaseController = require('./BaseController')
const ArticleModel = require('../model/Article')
const CategoryModel = require('../model/Category')
const UserModel = require('../model/User')

ArticleModel.belongsTo(CategoryModel, { as: 'c', foreignKey: 'cate_id', targetKey: 'cid' })
ArticleModel.belongsTo(UserModel, { as: 'u', foreignKey: 'author_id', targetKey: 'uid' })

class ArticleController extends BaseController {
  // 文章列表
  static async getArticleList(ctx) {
    const res = await ArticleModel.findAndCountAll({
      attributes: [
        'aid',
        'title',
        'state',
        'cover_img',
        'pub_date',
        [Sequelize.col('c.name'), 'category'],
        [Sequelize.col('u.username'), 'author']
      ],
      where: {
        is_delete: 0
      },
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
    const res = await ArticleModel.findOne({
      attributes: [
        'aid',
        'title',
        'state',
        'cover_img',
        'pub_date',
        [Sequelize.col('c.name'), 'category'],
        [Sequelize.col('u.username'), 'author']
      ],
      where: {
        is_delete: 0,
        aid: ctx.params.id
      },
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
      pub_date: new Date(),
      author_id: ctx.state.user.id
    })
    ctx.body = super.renderJsonSuccess(res)
  }

  // 更新文章
  static async updateArticle(ctx) {
    let articleInfo = ctx.request.body
    if (ctx.file) {
      articleInfo = {
        ...ctx.request.body,
        cover_img: path.join('/public', ctx.file.filename)
      }
    }
    const res = await ArticleModel.update(articleInfo, {
      where: {
        aid: articleInfo.aid
      }
    })
    ctx.body = super.renderJsonSuccess()
  }

  // 删除文章
  static async deleteArticle(ctx) {
    const res = await ArticleModel.update(
      { is_delete: 1 },
      {
        where: {
          aid: ctx.request.body.id
        }
      }
    )
    ctx.body = super.renderJsonSuccess()
  }
}

module.exports = ArticleController
