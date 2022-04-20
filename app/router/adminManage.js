'use strict'

/**
 * @param {Egg.Application} app - egg application
 */

module.exports = ({
  router,
  controller: {
    adminManage: {
      adminUser,
    },
  },
}) => {

  router.get('/admin_user/info', adminUser.getUserInfo) // 获取用户信息
  router.post('/admin_user/modify-role', adminUser.modifyRole) // 修改用户角色
  router.get('/admin_user/list', adminUser.getUserList) // 获取所有的用户
}
