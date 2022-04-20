'use strict'

const Controller = require('../baseController')

class adminUserController extends Controller {
  /**
   * 获取用户信息
   */
  async getUserInfo() {
    const userId = this.user.id
    // 后期可添加更多用户字段
    const userInfo = await this.ctx.service.adminManage.adminUser.find(null, { id: userId }, true)
    const data = {
      id: userId,
      name: this.user.name,
      avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      roles: userInfo.role.split(','),
      introduction: 'I am a super administrator',
    }
    this.success({ data })
  }
  /**
   * 获取所有账号数据
   */
  async getUserList() {
    const { ctx } = this
    const { limit, offset, ...params } = this.paginationDeal(ctx.request.query)
    const { list, total } = await this.ctx.service.adminManage.adminUser.getUser({ limit, offset, ...params })
    const data = { list, total }
    this.success({ data })
  }
  /**
   * 修改用户角色
   */
  async modifyRole() {
    const { ctx } = this
    this.ctx.validate({ // 校验参数
      id: { require: true, type: 'number' },
      role: { require: true, type: 'string' },
    })
    const { id, role } = ctx.request.body
    const data = await this.ctx.service.adminManage.adminUser.modifyRole(id, role)
    this.success({ data })
  }
}

module.exports = adminUserController
