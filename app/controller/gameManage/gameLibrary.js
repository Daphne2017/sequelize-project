'use strict'
const baseController = require('../baseController')

class gameLibraryController extends baseController {
  constructor(prop) {
    super(prop)
    // 游戏状态态
    this.gameStatusObj = {
      0: '已下架',
      1: '上架中',
    }
  }
  /**
   * @param { Boolean } isExport 是否导出
   * @return {Promise} 接口返回的Promise对象
   */
  async gamesList(isExport) {

    const { ctx } = this
    const { limit, offset, order = {}, gameName, putStatus } = this.paginationDeal(ctx.request.query)
    const pageObj = { limit, offset }
    const filterObj = this.app.utils.index.filterObjProp({ putStatus }) // 其他过滤条件
    const { col, sort } = this.app.utils.index.returnObject(order)
    const orderArr = [[ col || 'id', sort || 'DESC' ]] // 排序条件查询
    console.log('ctx.request.query', this.paginationDeal(ctx.request.query))

    let { list, total } = await this.service.gameManage.gameLibrary.getGamesList({ pageObj, gameName, filterObj, orderArr })
    list = await this.gameDataFlat(list) // 是否对返回的数据进行处理
    return { data: { list, total } }
  }
  /**
   * 获取所有游戏
   */
  async getAllGames() {
    const { service } = this
    // let allGames = await this.ctx.service.redis.get('allGames')
    // if (allGames) { console.log('存在redis缓存') }
    // if (!allGames) {
    //   console.log('没有redis缓存')
    //   allGames = await service.gameManage.gameLibrary.getAllGames()
    //   await this.ctx.service.redis.set('allGames', allGames, 60 * 60)
    // }

    console.log('没有redis缓存')
    const allGames = await service.gameManage.gameLibrary.getAllGames()
    this.success({ data: allGames })
  }
  /**
   * 关联表嵌套数据平级处理
   * @param { Array } list 查表result原始数据
   */
  async gameDataFlat(list) {
    // 处理嵌套数据
    const listData = list.map(node => {
      const itemList = node.toJSON()
      const { associateTags, putStatus, ...rest } = itemList
      const tagData = this.app.utils.index.returnArray(associateTags)
      const data = tagData.map(item => {
        item.tagInfo = this.app.utils.index.returnObject(item.tagInfo)
        const { id, tagInfo: { tagName } } = item
        return { name: tagName || '--', id }
      })
      return { associateTags: data || [], associateTagsNames: data.length && data.map(item => item.name).join(',') || '--', putStatus, putStatusName: this.gameStatusObj[putStatus], ...rest }
    })
    return listData
  }
  /**
   * 更新游戏上下架
   */
  async updatePutStatus() {
    const id = Number(this.ctx.params.id)
    this.ctx.validate({ // 校验参数
      putStatus: { require: true, type: 'number' },
    })
    const { putStatus } = this.ctx.request.body
    const data = await this.service.gameManage.gameLibrary.updatePutStatus({ id, putStatus })
    this.success({ data })
  }
  /**
   *  获取游戏列表
   */
  async getGamesList() {
    const res = await this.gamesList(false)
    this.success(res)
  }
  /**
   *  新增游戏
   */
  async addGameSubmit() {
    await this.updateGame('new')
  }
  /**
   * 编辑游戏
   */
  async editGameSubmit() {
    const { ctx } = this
    this.ctx.validate({
      id: { require: true, type: 'string' },
    }, this.ctx.params)
    const id = Number(ctx.params.id)
    await this.updateGame('edit', id)
  }
  /**
   * 更新游戏
   * @param {String} type 当前操作类型
   * @param {Number} id 游戏id
   */
  async updateGame(type, id = '') {
    const { ctx, service } = this
    console.log('新增游戏')
    const { associateTags, oldAssociateTags = [], ...rest } = this.verifyData(type) // 校验前端传参
    const transaction = await this.ctx.model.transaction()
    let res = null
    try {
      res = !id ? await service.gameManage.gameLibrary.addGameSubmit({ ...rest }, transaction)
        : await service.gameManage.gameLibrary.editGameSubmit(id, { ...rest }, transaction) // 新增 / 编辑
      await Promise.all([
        this.updateAssociateTags(res.id || id, associateTags, transaction), // 更新游戏关联的标签
      ])
      await this.updateTagRelatedGameCount({ associateTags, oldAssociateTags }, transaction) // 更新标签关联的游戏数数量
      await transaction.commit()
      this.success({ data: res })
    } catch (error) {
      await transaction.rollback()
      ctx.onerror(error)
    }
  }

  /**
   * 通过gameId获取关联标签
   */
  async getRelatedTagsBygameId() {
    console.log('getRelatedTagsBygameId')
    const gameId = Number(this.ctx.params.gameId)
    const list = await this.service.gameManage.gameLibrary.getRelatedTagsBygameId(gameId)

    this.success({ data: list })
  }
  /**
   * 添加游戏关联标签
   *  @param { Number } id 游戏id
   *  @param { Array } associateTags 游戏关联的标签数据
   *  @param { object } transaction 事务对象
   */
  async updateAssociateTags(id, associateTags = [], transaction) {
    await this.service.gameManage.gameLibrary.deleteAssociateTags(id, transaction) // 先删除已关联
    await this.service.gameManage.gameLibrary.addAssociateTags(id, associateTags, transaction) // 重新插入
  }
  /**
   *  更新标签关联游戏数related_game_count字段
   * @param { Object } obj 涉及到的标签id集合
   * @param { Array } obj.associateTags 游戏新关联的标签数据
   * @param { Array } obj.oldAssociateTags 游戏旧关联的标签数据
   * @param { object } transaction 事务对象
   */
  async updateTagRelatedGameCount({ associateTags = [], oldAssociateTags = [] }, transaction) {
    const unqueIdArr = [ ...new Set([ ...associateTags, ...oldAssociateTags ].map(item => item.id)) ] // 去除重复的tagid
    const tagRelatedGamecountObj = await this.service.gameManage.gameLibrary.tagRelatedGameCount(unqueIdArr, transaction) // 分别统计新增/编辑时涉及到的标签所关联游戏数count
    await this.service.gameManage.gameLibrary.updateTagRelatedGameCount(tagRelatedGamecountObj, transaction) // 更新标签库表中部分标签的related_game_count字段
  }
  /**
   * 处理前端发送的游戏参数
   * @param {String} type 校验的类型
   * @return { Object } 游戏数据
   */
  verifyData(type) {
    const newObj = { // 校验参数
      gameName: { require: true, type: 'string' },
      simpleDesc: { require: true, type: 'string' },
      putStatus: { require: true, type: 'number' },
      associateTags: { require: true, type: 'array' },
    }
    const editObj = {
      oldAssociateTags: { require: true, type: 'array' },
    }
    this.ctx.validate(type === 'new' ? { ...newObj } : { ...newObj, ...editObj })
    const { gameName, simpleDesc, putStatus, associateTags, oldAssociateTags = [] } = this.ctx.request.body

    const newParams = {
      gameName,
      simpleDesc,
      putStatus,
      associateTags,
    }
    return type === 'new' ? { ...newParams } : { ...newParams, oldAssociateTags }
  }

}

module.exports = gameLibraryController
