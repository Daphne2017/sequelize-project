
'use strict'

module.exports = app => {
  const { INTEGER, STRING, DATE } = app.Sequelize

  const UserRole = app.model.define('user_role', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: STRING(255),
      comment: '角色名称',
      allowNull: false,

    },
    code: {
      type: STRING(255),
      comment: '角色code',
      allowNull: false,
    },
    isDeleted: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '是否删除',
    },
    createdAt: {
      type: DATE,
      comment: '数据创建时间',
    },
    updatedAt: {
      type: DATE,
      comment: '数据更新时间',
    },
  }, {
    alter: true,
  })
  UserRole.associate = function() {
    this.belongsTo(app.model.AdminUser, { foreignKey: 'code', targetKey: 'role', as: 'users' })
  }
  return UserRole
}
