'use strict'

const Controller = require('egg').Controller

class HomeController extends Controller {
  async index() {
    const { ctx } = this
    ctx.body = '欢迎来到火星游戏~'
  }
}

module.exports = HomeController
