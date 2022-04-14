'use strict'
/*  菜单列表  */
module.exports = app => {
  const { INTEGER, STRING, BOOLEAN } = app.Sequelize

  const AdminMenu = app.model.define('admin_menus', {
    menu_id: {
      type: INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
    },
    menu_name: {
      type: STRING(100),
      allowNull: false,
      comment: '菜单名称',
    },
    menu_url: {
      type: STRING(100),
      allowNull: false,
      comment: '菜单URL',
    },
    menu_code: {
      type: STRING(100),
      allowNull: false,
      unique: true,
      comment: '唯一标识，用于权限接口返回给前端',
    },
    menu_parent: {
      type: INTEGER(11),
      defaultValue: 0,
      comment: '菜单上级的id, 没有上级则为0',
    },
    menu_order: {
      type: INTEGER(11),
      allowNull: false,
      defaultValue: 1,
      comment: '菜单排序',
    },
    is_visible: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: '该菜单是否隐藏, 1: 显示, 0: 隐藏',
    },
    status: {
      type: INTEGER(11),
      allowNull: false,
      defaultValue: 1,
      comment: '菜单状态，1: 正常, 0: 失效',
    },
  })

  AdminMenu.associate = function() {
    this.belongsTo(app.model.AdminPrivilege, { foreignKey: 'menu_id', targetKey: 'privilege_access_value' })
  }

  return AdminMenu
}
