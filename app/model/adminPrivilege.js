'use strict'
/*  权限对照表  */
module.exports = app => {
  const { INTEGER, STRING, ENUM } = app.Sequelize

  const AdminPrivilege = app.model.define('admin_privileges', {
    privilege_id: {
      type: INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
    },
    privilege_master: {
      type: STRING(100),
      allowNull: false,
      comment: '用户或角色..., user/role...',
    },
    privilege_master_value: {
      type: INTEGER(11),
      allowNull: false,
      comment: '用户或角色对应的ID',
    },
    privilege_access: {
      type: STRING(100),
      allowNull: false,
      comment: '菜单或按钮..., menu/button...',
    },
    privilege_access_value: {
      type: INTEGER(11),
      allowNull: false,
      comment: '菜单或按钮对应的ID',
    },
    privilege_operation: {
      type: ENUM('enabled', 'disabled'),
      defaultValue: 'disabled',
      allowNull: false,
      comment: '权限启用, enabled: 启用, disabled: 禁用',
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: [ 'privilege_master', 'privilege_master_value', 'privilege_access', 'privilege_access_value' ],
      },
    ],
  })

  AdminPrivilege.associate = function() {
    this.hasOne(app.model.AdminMenu, { foreignKey: 'menu_id', sourceKey: 'privilege_access_value' })
  }

  return AdminPrivilege
}
