
'use strict'
const Service = require('egg').Service
class gameLibraryService extends Service {
  /**
   * 获取游戏列表
   * @param { Object } body 查询条件数据对象
   * @param { Object } body.pageObj 分页对象
   * @param { String } body.gameName 游戏
   * @return { Object } list数据表游戏记录集合，total当前筛选条件下的记录总条数
   */
  async getGamesList({ gameName }) {
    const { Op } = this.app.Sequelize
    // 开始查询
    const { rows, count } = await this.ctx.model.GameGames.findAndCountAll({
      attributes: [ 'id', 'gameName', 'gameIcon' ], // 返回的属性
      where: {
        gameName: {
          [Op.like]: `%${gameName || ''}%`,
        },
      },
      include: [
        { // 关联游戏标签表
          model: this.app.model.GameGameTag,
          as: 'associateTags',
          attributes: [[ 'tag_id', 'id' ]],
          raw: true,
          include: [
            {
              model: this.app.model.GameTags, // 获取标签信息
              as: 'tagInfo',
              attributes: [ 'tagName' ],
            },
          ],
        },
      ],
      // distinct: true,   // 这一句可以去重，它返回的 count 不会把你的 include 的数量算进去
      order: [[ 'id', 'DESC' ]],
    })
    return { list: rows, total: count }
  }
  /**
   * 新增游戏
   * @param { Object } body 游戏参数
   * @return {Promise} 返回新增游戏
   */
  async addGameSubmit(body) {
    return await this.ctx.model.GameGames.create(body)
  }
  /**
   * 更新游戏
   * @param { number } id 游戏id
   * @param { Object } body 游戏数据
   * @return { Promise } 数据插入结果
   */
  async editGameSubmit(id, body) {
    return await this.ctx.model.GameGames.update(
      { ...body },
      { where: { id },
      },
    )
  }
  /**
 * 获取游戏关联的标签
 * @param { number } gameId 标签id
 * @return { Promise } 返回更新的标签
 */
  async getRelatedTagsBygameId(gameId) {
    return await this.ctx.model.GameGameTag.findAll({
      where: { gameId },
      distinct: true,
      include: [
        {
          model: this.app.model.GameTags,
          as: 'tagInfo',
          attributes: [ 'tagName', 'id' ],
        },
      ],
      order: [[ 'id', 'ASC' ]],
    })
  }
}
module.exports = gameLibraryService
