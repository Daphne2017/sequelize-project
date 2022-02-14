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

    return app.jwt.sign(
      tokenInfo,
      app.config.jwt.secret,
      {
        expiresIn: '7d', // 7天后过期
      }
    )
  }
}

module.exports = OauthService
