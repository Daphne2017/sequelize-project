'use strict'
const baseController = require('../baseController')

class gameLibraryController extends baseController {
  /**
   * @return {Promise} 接口返回的Promise对象
   */
  async gamesList() {
    const { ctx } = this
    const { limit, offset, gameName } = this.paginationDeal(ctx.request.query)
    const { list, total } = await this.service.gameManage.gameLibrary.getGamesList({ pageObj: { limit, offset }, gameName })
    return { data: { list, total } }
  }
  /**
     *  获取游戏列表，不进行联表查询，只返回简单字段
     */
  async getGamesList() {
    const res = await this.gamesList(false)
    this.success(res)
  }
  /**
   *  新增游戏
   */
  async addGameSubmit() {
    console.log('新增游戏')
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
    const { ...rest } = this.verifyData(type) // 校验前端传参
    let res = null
    try {
      res = !id ? await service.gameManage.gameLibrary.addGameSubmit({ ...rest })
        : await service.gameManage.gameLibrary.editGameSubmit(id, { ...rest }) // 新增 / 编辑
      this.success({ data: res })
    } catch (error) {
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
   * 处理前端发送的游戏参数
   * @param {String} type 校验的类型
   * @return { Object } 游戏数据
   */
  verifyData(type) {
    const newObj = { // 校验参数
      gameName: { require: true, type: 'string' },
      gameIcon: { require: true, type: 'string' },
      simpleDesc: { require: true, type: 'string' },
      // putStatus: { require: true, type: 'number' },
    }
    const editObj = {
    }
    this.ctx.validate(type === 'new' ? { ...newObj } : { ...newObj, ...editObj }) // 对参数进行校验
    const { gameName, gameIcon, simpleDesc, putStatus } = this.ctx.request.body

    const newParams = {
      gameName,
      simpleDesc,
      gameIcon,
      putStatus,
    }
    return type === 'new' ? { ...newParams } : { ...newParams }
  }

}

module.exports = gameLibraryController
