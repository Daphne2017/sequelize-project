
'use strict'
const Service = require('egg').Service
class gameLibraryService extends Service {
  /**
   * 新增游戏
   * @param { Object } body 游戏参数
   * @param { object } transaction 事务对象
   * @return {Promise} 返回新增游戏
   */
  async addGameSubmit(body, transaction) {
    return await this.ctx.model.GameGames.create(body, { transaction })
  }
  /**
   * 更新游戏
   * @param { number } id 游戏id
   * @param { Object } body 游戏数据
   * @param { object } transaction 事务对象
   * @return { Promise } 数据插入结果
   */
  async editGameSubmit(id, body, transaction) {
    return await this.ctx.model.GameGames.update(
      { ...body },
      { where: { id },
        transaction,
      },
    )
  }
}
module.exports = gameLibraryService
