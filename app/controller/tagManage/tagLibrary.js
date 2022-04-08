'use strict'

const baseController = require('../baseController')

class tagLibraryController extends baseController {
  constructor(prop) {
    super(prop)
    this.header = [ // 初始化数据导出的excel头
      { header: 'ID', key: 'id', width: 10 },
      { header: '标签名称', key: 'tagName', width: 20 },
      { header: '标签热度', key: 'heat', width: 20 },
      { header: '关联游戏数', key: 'relatedGameCount', width: 20 },
      { header: '状态', key: 'putStatusText', width: 20 },
    ]
    this.putStatusOb = {
      0: '已下架',
      1: '上架中',
    }
  }
  /**
   * @param { Boolean } isExport 当前是否导出
   * @return {Promise} 接口返回的Promise对象
   */
  async tagList(isExport) {
    const { limit, offset, order = {}, putStatus, tagName } = this.paginationDeal(this.ctx.request.query)
    const { col, sort } = this.app.utils.index.returnObject(order)
    const orderArr = [[ col || 'relatedGameCount', sort || 'DESC' ]]
    const pageOb = !isExport ? { limit, offset } : {}
    const putStatusOb = putStatus ? { putStatus } : {} // 标签状态
    const { list, total } = await this.service.tagManage.tagLibrary.getTagList({ pageOb, putStatusOb, orderArr, tagName })
    const listData = list.map(node => {
      const itemList = node.toJSON()
      const putStatusText = this.putStatusOb[itemList.putStatus] || '--'
      return { ...itemList, putStatusText }
    })
    const totalCount = !isExport && await this.service.tagManage.tagLibrary.getTagCount() || 0
    return { data: { list: listData, total, totalCount, user: this.ctx.state.user } }
  }
  /**
   * 获取标签列表
   */
  async getTagList() {
    const res = await this.tagList(false)
    this.success(res)
  }
  /**
   * 批量导出标签库
   */
  async getTagListExport() {
    const { data: { list = [] } } = await this.tagList(true)
    // 配置导出信息
    const baseExcelInfo = {
      data: list,
      filename: 'tagListData',
      header: this.header,
      sheetName: '标签库',
    }
    await this.service.common.exportFile.exportExcel(baseExcelInfo)
  }
  /**
   * 更新标签
   * @param {number} id 标签id
   */
  async updateTag(id = '') {
    const { ctx, service } = this
    ctx.validate({ // 校验参数
      tagName: { require: true, type: 'string' },
    })
    const { tagName, putStatus = 1, weight = 0 } = ctx.request.body
    const transaction = await this.ctx.model.transaction()
    const body = { tagName, relatedGameCount: 0, putStatus, weight: +weight }
    try {
      const res = !id ? await service.tagManage.tagLibrary.addTag(body, transaction)
        : await service.tagManage.tagLibrary.updateTag(id, body, transaction) // 更新标签关联游戏数字段值
      await transaction.commit()
      this.success({ data: res })
    } catch (error) {
      await transaction.rollback()
      ctx.onerror(error)
    }
  }
  /**
   * 新增标签
   */
  async addTag() {
    await this.updateTag()
  }
  /**
   * 编辑标签
   */
  async eidtTag() {
    const { ctx } = this
    this.ctx.validate({
      id: { require: true, type: 'string' },
    }, this.ctx.params)
    const id = Number(ctx.params.id)
    await this.updateTag(id)
  }
  /**
   * 添加标签关联游戏
   *  @param { Number } id 标签id
   *  @param { Object } gameData 游戏数据
   *  @param { object } transaction 事务对象
   */
  async addGames(id, gameData, transaction) {
    await this.service.tagManage.tagLibrary.deleteGame(id, transaction) // 先删除已关联
    await this.service.tagManage.tagLibrary.addGame(id, gameData, transaction) // 重新插入
  }
  /**
   * 通过tagId获取关联游戏
   */
  async getRelatedGamesByTagId() {
    const tagId = Number(this.ctx.params.tagId)
    const list = await this.service.tagManage.tagLibrary.getRelatedGamesByTagId(tagId)
    const listData = list.map(node => {
      const itemList = node.toJSON()
      const { gameData, ...rest } = itemList
      const data = this.app.utils.index.returnObject(gameData)
      return { ...data, ...rest }
    })
    this.success({ data: listData })
  }
  /**
   * 标签上下架
   */
  async updatePutStatus() {
    const id = Number(this.ctx.params.id)
    this.ctx.validate({ // 校验参数
      putStatus: { require: true, type: 'number' },
    })
    const { putStatus } = this.ctx.request.body
    const data = await this.service.tagManage.tagLibrary.updatePutStatus({ id, putStatus })
    this.success({ data })
  }
  /**
   * 修改标签权重
   */
  async updateWeight() {
    const id = Number(this.ctx.params.id)
    this.ctx.validate({ // 校验参数
      weight: { require: true, type: 'number' },
    })
    const { weight } = this.ctx.request.body
    const data = await this.service.tagManage.tagLibrary.updateWeight({ id, weight })
    this.success({ data })
  }
}

module.exports = tagLibraryController
