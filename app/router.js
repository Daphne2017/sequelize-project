'use strict'

/**
 * @param {Egg.Application} app - egg application
 */

module.exports = app => {

  app.router.get('/', app.controller.home.index)

  // 用户鉴权
  require('./router/auth')(app)
}
