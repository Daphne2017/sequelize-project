'use strict'

const { Service } = require('egg')

class hxAdminUserService extends Service {
  /**
   * 查找所有符合条件的用户
   * @param {array} attributes 需要查询的字段
   * @param {object} where 查询条件
   * @param {boolean} onlyOne 默认使用findAll。此参数为true时，使用findOne
   * @return {array | object} 返回用户Model实例数组或对象
   */
  async find(attributes, where, onlyOne) {
    const attr = attributes || [ 'id', 'w_id', 'username' ]
    const methodName = onlyOne ? 'findOne' : 'findAll'

    return await this.ctx.model.AdminUser[methodName]({
      attributes: attr,
      where,
    })
  }
  /**
   * 校验用户登录信息
   * @param {string} username 用户名
   * @param {string} password 密码
   * @return {object} 返回用户Model实例
   */
  async validate(username, password) {
    if (!username) throw new Error('缺少用户名')
    if (!password) throw new Error('缺少密码')
    const userModel = await this.find([ 'id', 'w_id', 'username', 'is_admin' ], {
      username,
      password: this.app.utils.index.sha1(username + password),
    }, true)

    if (userModel && userModel.get('id')) {
      return userModel
    }

    throw new Error('用户名或密码错误')
  }

}

module.exports = hxAdminUserService
