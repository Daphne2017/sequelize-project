'use strict'

const baseController = require('../baseController')

class tagLibraryController extends baseController {
  /**
   * @param { Boolean } isExport 当前是否导出
   * @return {Promise} 接口返回的Promise对象
   */
  async getRole(isExport) {
    const { limit, offset, order = {}, name } = this.paginationDeal(this.ctx.request.query)
    const { col, sort } = this.app.utils.index.returnObject(order)
    const orderArr = [[ col || 'id', sort || 'DESC' ]]
    const pageOb = !isExport ? { limit, offset } : {}
    const { list, total } = await this.service.roleManage.userRole.getList({ pageOb, orderArr, name })
    return { data: { list, total } }
  }
  /**
   * 获取列表
   */
  async getList() {
    const res = await this.getRole(false)
    this.success(res)
  }
  /**
   * 更新标签
   * @param {number} id 标签id
   */
  async update(id = '') {
    const { ctx, service } = this
    ctx.validate({ // 校验参数
      name: { require: true, type: 'string' },
    })
    const { name, code } = ctx.request.body
    const body = { name, code }
    try {
      const res = !id ? await service.roleManage.userRole.add(body)
        : await service.roleManage.userRole.update(id, body) // 更新标签关联游戏数字段值
      this.success({ data: res })
    } catch (error) {
      ctx.onerror(error)
    }
  }
  /**
   * 新增标签
   */
  async add() {
    await this.update()
  }
  /**
   * 编辑标签
   */
  async edit() {
    const { ctx } = this
    this.ctx.validate({
      id: { require: true, type: 'string' },
    }, this.ctx.params)
    const id = Number(ctx.params.id)
    await this.update(id)
  }
}

module.exports = tagLibraryController
