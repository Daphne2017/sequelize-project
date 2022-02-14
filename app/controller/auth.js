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
    this.userModel = await ctx.service.adminManage.hxAdminUser.validate(username, password)
    const tokenInfo = this.userModel.toJSON()
    jwtToken = await ctx.service.auth.createJwtToken(tokenInfo)

    this.success({
      data: {
        id: this.userModel.get('id'),
        username: this.userModel.get('username'),
        name: this.userModel.get('w_id'),
        token: jwtToken,
      },
    })
    return jwtToken
  }

  /**
   * 用户登出（已弃用）
   */
  async logout() {
    this.user = null
    this.success()
  }
}

module.exports = AuthController
