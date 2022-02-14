'use strict';
// 游戏排行汇总表
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, STRING, TINYINT } = Sequelize;
    await queryInterface.createTable('my-test', {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      game_id: {
        type: INTEGER,
        allowNull: false,
        comment: '游戏id',
        defaultValue: 0,
      },
      type: {
        type: STRING(10),
        allowNull: false,
        comment: '1、"day":表示日数据汇总;2、"week":表示周数据汇总;3、"month"表示月数据汇总',
        defaultValue: '',
      },
      is_online: {
        type: TINYINT(1),
        allowNull: false,
        comment: '是否线上游戏,0:否,1:是',
        defaultValue: 0,
      },
      start_time: {
        type: 'TIMESTAMP',
        allowNull: false,
        comment: '汇总数据的开始时间',
        defaultValue: 0,
      },
      end_time: {
        type: 'TIMESTAMP',
        allowNull: false,
        comment: '汇总数据的结束时间',
        defaultValue: 0,
      },
      game_name: {
        type: STRING(50),
        allowNull: false,
        comment: '游戏名称',
        defaultValue: '',
      },
      play_seconds: {
        type: INTEGER(11),
        allowNull: false,
        comment: '游戏时长,单位秒',
        defaultValue: 0,
      },
      play_peoples: {
        type: INTEGER(11),
        allowNull: false,
        comment: '游戏人数',
        defaultValue: 0,
      },
      created_at: {
        type: 'TIMESTAMP',
        allowNull: false,
        comment: '数据创建时间',
      },
      updated_at: {
        type: 'TIMESTAMP',
        allowNull: false,
        comment: '数据更新时间',
      },
    },
    {
      comment: '游戏排行榜列表',
      uniqueKeys: {
        one_record: {
          customIndex: true,
          fields: [ 'type', 'start_time', 'end_time', 'game_id', 'is_online' ],
        },
      },
    });
    // 添加索引
    queryInterface.addIndex('my-test', [ 'type' ]);
  },
  down: async queryInterface => {
    await queryInterface.dropTable('my-test');
  },
};

