'use strict'

/**
 * @param {Egg.Application} app - egg application
 */

module.exports = ({
  router,
  controller: {
    auth,
  },
}) => {
  // 登录接口
  router.post('/login', auth.login)
}
