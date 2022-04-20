'use strict'

const Controller = require('./baseController')

class AuthController extends Controller {
  constructor(prop) {
    super(prop)

    this.userModel = null
  }
  /**
   * 用户登录
   * @param {Object} userModel 用户Model实例
   * @return {String} 返回用户的 jwt token
   */
  async login(userModel) {
    const { ctx } = this
    let jwtToken = null

    if (userModel && userModel.get('id')) {
      this.userModel = userModel
    } else {
      // 用户名密码登录
      const { username, password } = ctx.request.body
      // 校验用户是否存在
      this.userModel = await ctx.service.adminManage.adminUser.validate(username, password)
    }
    // modal对象转json
    const tokenInfo = this.userModel.toJSON()
    // 创建用户token
    jwtToken = await ctx.service.auth.createJwtToken(tokenInfo)
    // 把token作为key存当前用户信息到redis中
    await this.app.redis.hmset(jwtToken, {
      id: tokenInfo.id,
      username: tokenInfo.username,
      isAdmin: tokenInfo.is_admin,
    })
    this.success({
      data: {
        id: this.userModel.get('id'),
        username: this.userModel.get('username'),
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
      },
    })
  }
  /**
   * 注册用户
   */
  async register() {

    // 参数校验
    this.ctx.validate({
      username: { require: true, type: 'string' },
      password: { require: true, type: 'string' },
    })
    const { username, password } = this.ctx.request.body
    this.userModel = await this.ctx.service.adminManage.adminUser.create({
      username,
      password,
    })
    // 登录
    const jwtToken = await this.login(this.userModel)
  }
}

module.exports = AuthController
