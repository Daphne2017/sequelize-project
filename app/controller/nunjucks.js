'use strict'

const baseController = require('./baseController')

class nunjucksController extends baseController {
  async index() {
    const data = [ '苹果', '香蕉', '雪梨' ]
    const { ctx } = this
    // 传递参数{ fruits: data }到模板页面
    await ctx.render('index', { fruits: data })
  }
}

module.exports = nunjucksController
