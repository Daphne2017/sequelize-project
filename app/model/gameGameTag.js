'use strict'
/*  标签库列表  */
module.exports = app => {
  const { INTEGER } = app.Sequelize

  const GameGameTag = app.model.define('game_game_tag', {
    gameId: {
      type: INTEGER.UNSIGNED,
      primaryKey: true,
      allowNull: false,
      comment: '游戏id',
      field: 'game_id',
    },
    tagId: {
      type: INTEGER.UNSIGNED,
      primaryKey: true,
      allowNull: false,
      comment: '标签id',
      field: 'tag_id',
    },
    sort: {
      type: INTEGER(11),
      allowNull: false,
      defaultValue: 0,
      comment: '排序',
    },
  },
  {
    timestamps: false,
    indexes: [
      {
        name: 'tag_sort',
        using: 'BTREE',
        fields: [ 'tagId', 'sort' ],
      },
    ],
  })
  GameGameTag.associate = function() {
    this.belongsTo(app.model.GameGames, { foreignKey: 'gameId', targetKey: 'id', as: 'gameInfo' }) // 通过查询GameGameTag表，可根据tagId获取标签关联游戏的信息
    this.belongsTo(app.model.GameTags, { foreignKey: 'tagId', targetKey: 'id', as: 'tagInfo' }) // 通过查询GameGameTag表，可根据gameId获取游戏关联标签的信息
  }
  return GameGameTag
}
