'use strict'
const Service = require('egg').Service
class tagLibraryService extends Service {
  /**
   * 获取列表
   * @param { Object } body 查询条件数据对象
   * @param { Object } body.pageOb 分页对象
   * @param { Array } body.orderArr 列表排序数组
   * @param { String } body.name 标签
   * @return { Object } 标签数据
   */
  async getList({ pageOb, orderArr, name }) {
    const { Op } = this.app.Sequelize
    const { rows, count } = await this.ctx.model.UserRole.findAndCountAll({
      where: {
        name: {
          [Op.like]: `%${name || ''}%`,
        },
      },
      ...pageOb,
      order: orderArr,
    })
    return { list: rows, total: count }
  }
  /**
   * 编辑
   * @param { number } id 标签id
   * @param { Object } body 数据对象
   * @return { Promise } 返回更新的标签
   */
  async update(id, body) {
    return await this.ctx.model.UserRole.update(
      {
        ...body,
      },
      { where: { id },
      },
    )
  }
  /**
   * 新增标签
   * @param { Object } body 名称
   * @return { Promise } 返回插入的标签
   */
  async add(body) {
    return await this.ctx.model.UserRole.create(body)
  }
}

module.exports = tagLibraryService
