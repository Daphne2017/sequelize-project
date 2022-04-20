'use strict'

/**
 * @param {Egg.Application} app - egg application
 */

module.exports = app => {
  const {
    middleware,
    router,
    controller: {
      gameManage: {
        gameLibrary,
      },
    },
  } = app
  /** 游戏库*/
  const responseTime = middleware.responseTime({ headerKey: 'X-Router-Time' }, app)
  router.post('/gameManagement/gameLibrary/add', gameLibrary.addGameSubmit) // 新增游戏
  router.put('/gameManagement/gameLibrary/edit/:id', gameLibrary.editGameSubmit) // 编辑游戏
  router.get('/gameManagement/gameLibraryList', responseTime, gameLibrary.getGamesList) // 游戏库页面
  router.get('/gameMangement/gameLibrary/all', responseTime, gameLibrary.getAllGames) // 游戏库页面
  router.patch('/gameMangement/gameLibrary/updatePutStatus/:id', gameLibrary.updatePutStatus) // 游戏上下架
  router.get('/gameManagement/gameLibraryList/getRelatedTagsBygameId/:gameId', gameLibrary.getRelatedTagsBygameId) // 通过gameId获取关联的标签
}
