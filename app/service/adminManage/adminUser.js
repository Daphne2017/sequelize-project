'use strict'

const { Service } = require('egg')

class adminUserService extends Service {
  /**
   * 查找所有符合条件的用户
   * @param {array} attributes 需要查询的字段
   * @param {object} where 查询条件
   * @param {boolean} onlyOne 默认使用findAll。此参数为true时，使用findOne
   * @return {array | object} 返回用户Model实例数组或对象
   */
  async find(attributes, where, onlyOne) {
    const attr = attributes || [ 'id', 'username', 'role' ]
    const methodName = onlyOne ? 'findOne' : 'findAll'

    return await this.ctx.model.AdminUser[methodName]({
      attributes: attr,
      where,
    })
  }
  /**
   * 查询所有账号
   * @param { Object } Object 用于查询的数据
   * @param { String } Object.name 模糊查询姓名
   * @return { Object<{list: Array, total: Number}> } 返回查询数据
   */
  async getUser({ limit, offset, username, ...params }) {
    const { Op } = this.app.Sequelize
    const { rows, count } = await this.ctx.model.AdminUser.findAndCountAll({
      where: {
        username: {
          [Op.like]: `%${username || ''}%`,
        },
        ...params,
      },
      order: [[ 'id', 'DESC' ]],
      offset,
      limit,
    })
    return { list: rows, total: count }
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
    const userModel = await this.find([ 'id', 'username', 'isAdmin' ], {
      username,
      password: this.app.utils.index.sha1(username + password), // 密码加盐，因为注册的时候也加盐了
    }, true)

    if (userModel && userModel.get('id')) {
      return userModel
    }

    throw new Error('用户名或密码错误')
  }
  /**
   * 新增用户
   * @param {json} fields 用户字段集合
   * @return {Model} 返回新用户的Model对象
   */
  async create(fields) {
    const user = await this.ctx.model.AdminUser.findOne({
      where: {
        username: fields.username,
      },
    })
    if (user) throw new Error('用户名已存在')
    return await this.ctx.model.AdminUser.create(fields)
  }
  // 用户修改角色
  async modifyRole(id, role) {
    const { ctx } = this
    const isAdmin = await ctx.isAdminManager(ctx)
    // 如果不是系统管理员，则不能赋予系统管理员角色的权限
    if (!isAdmin && role.indexOf('admin') !== -1) {
      throw new Error('该账号没有赋予系统管理员角色的权限')
    }
    // 先判断是否存在，在更新用户
    const user = await this.ctx.model.AdminUser.findOne({
      where: {
        id,
      },
    })
    if (!user) throw new Error('用户名不存在')
    return this.ctx.model.AdminUser.update({
      role,
    }, {
      where: {
        id,
      },
    })
  }
}

module.exports = adminUserService
