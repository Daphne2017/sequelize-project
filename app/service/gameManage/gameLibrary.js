
'use strict'
const Service = require('egg').Service
class gameLibraryService extends Service {
  constructor(prop) {
    super(prop)
    // 游戏状态态
    this.gameStatusObj = {
      0: '已下架',
      1: '上架中',
    }
  }
  /**
   * 获取游戏列表
   * @param { Object } body 查询条件数据对象
   * @param { Object } body.pageObj 分页对象
   * @param { String } body.filterObj 其他
   * @param { String } body.orderArr 排序
   * @return { Object } list数据表游戏记录集合，total当前筛选条件下的记录总条数
   */
  async getGamesList({ pageObj, gameName, filterObj, orderArr }) {
    const { Op } = this.app.Sequelize
    // 开始查询
    const { rows, count } = await this.ctx.model.GameGames.findAndCountAll({
      attributes: { exclude: [ 'updatedAt' ] }, // 设置要返回的返回的属性
      // attributes: [ 'id', 'gameName' ], // 返回的属性
      where: {
        gameName: {
          [Op.like]: `%${gameName || ''}%`,
        },
        ...filterObj,
      },
      ...pageObj,
      include: [
        { // 关联游戏标签表
          model: this.app.model.GameGameTag,
          as: 'associateTags',
          attributes: [[ 'tag_id', 'id' ]],
          raw: true, // raw这个属性暂时还没有太理解
          include: [
            {
              model: this.app.model.GameTags, // 获取标签信息
              as: 'tagInfo',
              attributes: [ 'tagName' ],
            },
          ],
        },
      ],
      distinct: true, // 这一句可以去重，它返回的 count 不会把你的 include 的数量算进去
      order: orderArr,
    })
    return { list: rows, total: count }
  }
  /**
   * 游戏上下架
   * @param { Object } obj 参数对象
   * @param { number } obj.id 游戏id
   * @param { number } obj.putStatus 上下架参数
   * @return { Promise }  返回当前游戏
   */
  async updatePutStatus({ id, putStatus }) {
    return await this.ctx.model.GameGames.update(
      { putStatus },
      { where: { id } },
    )
  }
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
    })
  }
  /**
   *删除游戏已关联的标签
   * @param { Number } id 游戏id
   * @param { object } transaction 事务对象
   * @return { Promise } 被删除的标签
   */
  async deleteAssociateTags(id, transaction) {
    return this.ctx.model.GameGameTag.destroy({
      where: {
        gameId: id,
      },
      transaction,
    })
  }
  /**
   *新增游戏关联的标签
   * @param { Number } id 游戏id
   * @param { Array } associateTags 游戏关联的标签
   * @param { object } transaction 事务对象
   * @return { Array } 返回新插入的关联标签
   */
  async addAssociateTags(id, associateTags, transaction) {
    const arrTags = associateTags.map(item => {
      return {
        gameId: id,
        tagId: item.id,
      }
    })
    return await this.ctx.model.GameGameTag.bulkCreate(arrTags, { transaction }) // 批量插入
  }
  /**
   * 统计标签关联的游戏数
   * @param { Array } tagIdDatas 标签id集合
   * @param { object } transaction 事务对象
   * @return { Object } 返回当前标签对应关联游戏数的键值对
   */
  async relatedGameCount(tagIdDatas, transaction) {
    let sql = ''
    tagIdDatas.forEach(async id => {
      sql += `sum(case when tag_id = ${id} then 1 else 0 end) '${id}',`
    })
    sql = sql.substring(0, sql.lastIndexOf(','))
    const resArr = await this.app.model.query(
      `select ${sql} from game_game_tag;`,
      { type: 'SELECT', transaction })
    return resArr[0] // 查询结果在数组的第一个
  }
  /**
   * 批量更新标签库
   * @param { Number } relatedGamecountObj 标签关联游戏数对象
   * @param { object } transaction 事务对象
   */
  async updateRelatedGameCount(relatedGamecountObj, transaction) {
    const tagData = []
    for (const key in relatedGamecountObj) {
      if (relatedGamecountObj.hasOwnProperty(key)) {
        const tagItem = {
          id: key,
          relatedGameCount: relatedGamecountObj[key],
        }
        tagData.push(tagItem)
      }
    }
    await this.ctx.model.GameTags.bulkCreate(tagData, { updateOnDuplicate: [ 'relatedGameCount' ], transaction })
  }
}

module.exports = gameLibraryService
