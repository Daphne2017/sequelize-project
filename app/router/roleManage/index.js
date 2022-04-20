'use strict'

/**
 * @param {Egg.Application} app - egg application
 */

module.exports = ({
  router,
  controller: {
    roleManage: {
      userRole,
    },

  },
}) => {
  // 获取用户信息
  router.get('/role/list', userRole.getList)
  router.post('/role/list/add', userRole.add)
  router.put('/role/list/edit/:id', userRole.edit)
}
