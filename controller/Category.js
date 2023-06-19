const BaseController = require('./BaseController')
const CategoryModel = require('../model/Category')
const { Op } = require('sequelize')

class CategoryController extends BaseController {
  // 分类列表
  static async getCategoryList(ctx) {
    const res = await CategoryModel.findAll({
      attributes: ['cid', 'name'],
      where: {
        is_delete: 0
      }
    })
    ctx.body = super.renderJsonSuccess(res)
  }

  // 增加分类
  static async addCategory(ctx) {
    const cate = await CategoryModel.findOne({
      where: {
        name: ctx.request.body.name
      }
    })
    if (!cate) {
      const res = await CategoryModel.create({
        name: ctx.request.body.name
      })
      ctx.body = super.renderJsonSuccess(res)
    } else {
      ctx.body = super.renderJsonError('分类已存在')
    }
  }

  // 更新分类
  static async updateCategory(ctx) {
    const cate = await CategoryModel.findOne({
      where: {
        cid: {
          [Op.ne]: ctx.request.body.id
        },
        name: ctx.request.body.name
      }
    })
    if (!cate) {
      const res = await CategoryModel.update(
        { name: ctx.request.body.name },
        {
          where: { cid: ctx.request.body.id }
        }
      )
      ctx.body = super.renderJsonSuccess()
    } else {
      ctx.body = super.renderJsonError('分类已存在')
    }
  }

  // 删除分类
  static async deleteCategory(ctx) {
    const res = await CategoryModel.update(
      { is_delete: 1 },
      {
        where: { cid: ctx.request.body.id }
      }
    )
    ctx.body = super.renderJsonSuccess()
  }
}

module.exports = CategoryController
