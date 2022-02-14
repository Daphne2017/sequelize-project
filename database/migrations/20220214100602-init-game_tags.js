'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, STRING, TINYINT } = Sequelize

    await queryInterface.createTable('game_tags', {
      id: {
        type: INTEGER(11).UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        comment: '主键',
      },
      tagName: {
        type: STRING(255),
        allowNull: false,
        comment: '标签名称',
        field: 'tag_name',
        defaultValue: '',
      },
      relatedGameCount: {
        type: INTEGER(11),
        allowNull: false,
        comment: '关联游戏数',
        field: 'related_game_count',
        defaultValue: 0,
      },
      heat: {
        type: INTEGER(10),
        allowNull: false,
        comment: '标签热度',
        defaultValue: 0,
      },
      putStatus: {
        type: TINYINT(4),
        allowNull: false,
        comment: '状态',
        field: 'put_status',
        defaultValue: 0,
      },
      weight: {
        type: INTEGER(10).UNSIGNED,
        allowNull: false,
        comment: '标签权重，从高到低',
        defaultValue: 0,
      },
    })
  },
  down: async queryInterface => {
    await queryInterface.dropTable('game_tags')
  },
}
