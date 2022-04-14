'use strict'

const Controller = require('./baseController')

class AuthController extends Controller {
  constructor(prop) {
    super(prop)

    this.userModel = null
  }
  /**
   * 用户登录
   * @return {String} 返回用户的 jwt token
   */
  async login() {
    const { ctx } = this
    let jwtToken = null

    // 用户名密码登录，走这里
    const { username, password } = ctx.request.body
    this.userModel = await ctx.service.adminManage.adminUser.validate(username, password)
    const tokenInfo = this.userModel.toJSON()
    jwtToken = await ctx.service.auth.createJwtToken(tokenInfo)
    console.log('this.user', ctx.state)
    this.success({
      data: {
        user: this.user,
        id: this.userModel.get('id'),
        username: this.userModel.get('username'),
        name: this.userModel.get('w_id'),
        token: jwtToken,
      },
    })
    return jwtToken
  }

  /**
   * 用户登出
   */
  async logout() {
    this.success({
      data: {
        password: this.app.utils.index.sha1('18078867862huoxing2020'),
      },
    })
  }
}

module.exports = AuthController
