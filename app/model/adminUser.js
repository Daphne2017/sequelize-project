
'use strict'

module.exports = app => {
  const { INTEGER, STRING, BOOLEAN, DATE } = app.Sequelize

  const AdminUser = app.model.define('admin_users', {
    // 其他诸如：姓名、头像、手机之类的信息，直接从企业微信API获取
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: STRING(30),
      comment: '用户登录名',
    },
    password: {
      type: STRING,
      // 密码加密，用户名做盐
      set(value) {
        this.setDataValue('password', app.utils.index.sha1(this.username + value))
      },
      comment: '用户登录密码',
    },
    role: {
      type: STRING(50),
      defaultValue: 'test',
      allowNull: false,
    },
    isAdmin: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '是否为管理员',
    },
    status: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: '账号状态。禁用：0，正常：1',
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
  AdminUser.associate = function() {
    this.hasMany(app.model.UserRole, { foreignKey: 'code', sourceKey: 'role', as: 'roles' })
  }
  return AdminUser
}
