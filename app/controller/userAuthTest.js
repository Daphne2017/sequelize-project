'use strict'

const baseController = require('./baseController')

class userAuthTestController extends baseController {
  async index() {
    const data = [ '苹果', '香蕉', '雪梨' ]
    const { ctx } = this
    // 传递参数{ fruits: data }到模板页面
    if (this.ctx.session.user) {
      await ctx.render('home', { fruits: data })
    } else {
      this.ctx.redirect('/userAuthTest/login')

    }
  }
  async login() {
    const { ctx } = this
    await ctx.render('login')
  }
  async dologin() {
    const { username, password } = this.ctx.request.body
    if (username === 'yanyanshan' && password === '123') {
      this.ctx.session.user = username
      this.ctx.redirect('/userAuthTest/home')
    } else {
      this.ctx.redirect('/userAuthTest/login')
    }
  }
  async logout() {
    this.ctx.session.user = ''
    this.ctx.redirect('/userAuthTest/login')
  }
}

module.exports = userAuthTestController
