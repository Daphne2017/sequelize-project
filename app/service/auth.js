'use strict'

const { Service } = require('egg')
class OauthService extends Service {
  /**
   * 创建 JWT Token 并返回 Token 字符串
   * @param {Object} tokenInfo token 携带的信息
   * @return {String} 生成的 token 字符串
   */
  async createJwtToken(tokenInfo) {
    const { app } = this
    // egg-jwt 插件，在鉴权通过的路由对应 controller 函数中，会将 app.jwt.sign(tokenInfo, secrete)，包括exp和iat 加密的用户信息，添加到 ctx.state.user 中，。
    const token = app.jwt.sign(
      tokenInfo,
      app.config.jwt.secret,
      { expiresIn: app.config.jwt.expiresIn || '7d' }
    )
    return token
  }
}

module.exports = OauthService
