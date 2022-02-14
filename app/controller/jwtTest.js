'use strict'

const baseController = require('./baseController')

class jwtController extends baseController {
  /**
   * 登录返回token
   * sign 用户登录
   *
   * **/
  async dologin() {
    const user = this.ctx.request.body.user
    if (user.username === 'yanyanshan' && user.password === '123') {
      const user_jwt = { username: user.username }
      const token = this.app.jwt.sign(user_jwt, this.app.config.jwt.secret)
      this.success({ data: token })
      // this.ctx.redirect('/userAuthTest/home')
    } else {
      throw new Error('用户名或者密码错误')
    }

  }
  /**
   * 后台获取token并校验
   * sign 用户登录
   * **/
  async getMessage() {
    const token = this.ctx.request.header.token
    try {
      const decode = this.app.jwt.verify(token, this.app.config.jwt.secret) // 加密算法如何实现的？
      this.success({ data: { token, decode } })
    } catch (error) {
      throw new Error(`获取 Access Token 失败。（${error}）`)
    }
  }
  /**
   * 给用户对象生成一个token
   * sign 用户登录
   *
   * **/
  async index() {
    const user = {
      username: '严燕姗',

    }
    // egg-jwt 引入插件之后，就可以用this.app这个应用程序获取到jwt的对象
    // sign方法对对象进行加密，第一个参数是对象，第二个参数是密钥,如何获取密钥？this.app.config.jwt.secret
    // this.app.config.jwt.secret就能拿到配置文件里边的secret，sign方法已经封装好了加密算法
    const token = this.app.jwt.sign(user, this.app.config.jwt.secret) // 加密算法如何实现的？
    try {
      const decode = this.app.jwt.verify(13245, this.app.config.jwt.secret) // 加密算法如何实现的？
      this.success({ data: { token, decode } })
    } catch (error) {
      throw new Error(`获取 Access Token 失败。（${error}）`)
    }
  }
}

module.exports = jwtController
