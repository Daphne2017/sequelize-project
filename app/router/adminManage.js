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

  // 获取用户信息
  router.get('/admin_user/info', adminUser.getUserInfo)
}
