
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
      // 密码加密，用户名做盐
      set(value) {
        this.setDataValue('password', app.utils.index.sha1(this.username + value))
      },
      comment: '用户登录密码',
    },
    name: {
      type: STRING,
      comment: '姓名。从企业微信读取并保存。',
    },
    mobile: {
      type: STRING,
      comment: '手机号。从企业微信读取并保存',
    },
    gender: {
      type: STRING,
      comment: '性别。0表示未定义，1表示男性，2表示女性。从企业微信读取并保存。',
    },
    email: {
      type: STRING,
      comment: '邮箱。从企业微信读取并保存。',
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
      comment: '数据创建时间',
    },
    updated_at: {
      type: DATE,
      comment: '数据更新时间',
    },
  }, {
    alter: true,
  })

  return AdminUser
}
