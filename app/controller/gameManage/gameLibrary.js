'use strict'
const baseController = require('../baseController')

class gameLibraryController extends baseController {
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
    const { ...rest } = this.verifyData(type) // 校验前端传参
    const transaction = await this.ctx.model.transaction()
    let res = null
    try {
      res = !id ? await service.gameManage.gameLibrary.addGameSubmit({ ...rest }, transaction)
        : await service.gameManage.gameLibrary.editGameSubmit(id, { ...rest }, transaction) // 新增 / 编辑
      this.success({ data: res })
    } catch (error) {
      ctx.onerror(error)
    }
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
      putStatus: { require: true, type: 'number' },
      associateTags: { require: true, type: 'array' }, // 游戏关联的标签
    }
    const editObj = {
      oldAssociateTags: { require: true, type: 'array' },
    }
    this.ctx.validate(type === 'new' ? { ...newObj } : { ...newObj, ...editObj }) // 对参数进行校验
    const { gameName, gameIcon, simpleDesc, putStatus, associateTags, oldAssociateTags = [] } = this.ctx.request.body

    const newParams = {
      gameName,
      simpleDesc,
      gameIcon,
      putStatus,
      associateTags,
    }
    return type === 'new' ? { ...newParams } : { ...newParams, oldAssociateTags }
  }

}

module.exports = gameLibraryController
