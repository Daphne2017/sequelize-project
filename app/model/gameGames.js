'use strict'
/*  游戏库列表  */
module.exports = app => {
  const { INTEGER, STRING, DATE } = app.Sequelize

  const GameGames = app.model.define('game_games', {
    id: {
      type: INTEGER(11).UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      comment: '主键',
    },
    gameName: {
      type: STRING(255),
      allowNull: false,
      field: 'game_name',
      defaultValue: '',
      comment: '游戏名称',
    },
    gameIcon: {
      type: STRING(255),
      allowNull: false,
      comment: '游戏icon图标',
      field: 'game_icon',
      defaultValue: '',
    },
    simpleDesc: {
      type: STRING(255),
      allowNull: false,
      defaultValue: '',
      comment: '一句话描述',
      field: 'simple_desc',
    },
    putStatus: {
      type: INTEGER(3).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '上架状态',
      field: 'put_status',
    },
    createdAt: {
      type: DATE,
      comment: '创建时间',
      field: 'created_at',
    },
    updatedAt: {
      type: DATE,
      comment: '更新时间',
      field: 'updated_at',
    },
  })

  GameGames.associate = function() {
    this.hasMany(app.model.GameGameTag, { foreignKey: 'gameId', sourceKey: 'id', as: 'associateTags' }) // 根据gameId拿到关联的associateTags标签信息
  }

  return GameGames
}
