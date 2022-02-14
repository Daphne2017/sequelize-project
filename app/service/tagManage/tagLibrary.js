'use strict'
const Service = require('egg').Service
class tagLibraryService extends Service {
  /**
   * 获取标签列表
   * @param { Object } body 查询条件数据对象
   * @param { Object } body.pageOb 分页对象
   * @param { Object } body.putStatusOb 标签状态条件对象
   * @param { Array } body.orderArr 列表排序数组
   * @param { String } body.tagName 标签
   * @return { Object } 标签数据
   */
  async getTagList({ pageOb, putStatusOb, orderArr, tagName }) {
    const { Op } = this.app.Sequelize
    const { rows, count } = await this.ctx.model.GameTags.findAndCountAll({
      attributes: { exclude: [ 'createdAt', 'updatedAt' ] },
      where: {
        tagName: {
          [Op.like]: `%${tagName || ''}%`,
        },
        ...putStatusOb,
      },
      ...pageOb,
      order: orderArr,
    })

    return { list: rows, total: count }
  }
  /**
   *获取标签总数
   *@return { Number } 返回标签的总数
   */
  async getTagCount() {
    return await this.ctx.model.GameTags.count()
  }
  /**
   * 编辑标签
   * @param { number } id 标签id
   * @param { Object } body 数据对象
   * @param { string } body.tagName 名称
   * @param { number } body.relatedGameCount 标签关联游戏数
   * @param { object } transaction 事务对象
   * @return { Promise } 返回更新的标签
   */
  async updateTag(id, body, transaction) {
    return await this.ctx.model.GameTags.update(
      {
        ...body,
      },
      { where: { id },
        transaction,
      },
    )
  }
  /**
   * 新增标签
   * @param { Object } body 名称
   * @param { String } body.tagName 名称
   * @param { number } body.relatedGameCount 名称
   * @param { object } transaction 事务对象
   * @return { Promise } 返回插入的标签
   */
  async addTag(body, transaction) {
    return await this.ctx.model.GameTags.create(body, { transaction })
  }
  /**
   * 标签上下架
   * @param { Object } obj 参数对象
   * @param { number } obj.id 标签id
   * @param { number } obj.putStatus 上下架参数
   * @return { Promise }  返回当前标签
   */
  async updatePutStatus({ id, putStatus }) {
    return await this.ctx.model.GameTags.update(
      { putStatus },
      { where: { id } },
    )
  }
  /**
   * 更新标签权重
   * @param { Object } obj 参数对象
   * @param { number } obj.id 标签id
   * @param { number } obj.weight 标签权重
   * @return { Promise }  返回当前标签
   */
  async updateWeight({ id, weight }) {
    return await this.ctx.model.GameTags.update(
      { weight },
      { where: { id } },
    )
  }
}

module.exports = tagLibraryService
