'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, STRING, DATE, BOOLEAN } = Sequelize

    await queryInterface.createTable('admin_users', {
      // 其他诸如：姓名、头像、手机之类的信息，直接从企业微信API获取
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      w_id: {
        type: STRING,
        allowNull: false,
        comment: '企业微信ID',
      },
      username: {
        type: STRING(30),
        comment: '用户登录名',
      },
      password: {
        type: STRING,
        comment: '用户登录密码',
      },
      is_admin: {
        type: BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: '是否为管理员',
      },
      status: {
        type: BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: '账号状态。禁用：0，正常：1',
      },
      created_at: {
        type: DATE,
        allowNull: false,
        comment: '数据创建时间',
      },
      updated_at: {
        type: DATE,
        allowNull: false,
        comment: '数据更新时间',
      },
    })
  },
  down: async queryInterface => {
    await queryInterface.dropTable('admin_users')
  },
}
