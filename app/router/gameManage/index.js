'use strict'

/**
 * @param {Egg.Application} app - egg application
 */

module.exports = ({
  router,
  controller: {
    gameManage: {
      gameLibrary,
    },
  },
}) => {

  /** 游戏库*/
  router.post('/gameManagement/gameLibrary/add', gameLibrary.addGameSubmit) // 新增游戏
  router.put('/gameManagement/gameLibrary/edit/:id', gameLibrary.editGameSubmit) // 编辑游戏
  router.get('/gameManagement/gameLibraryList', gameLibrary.getGamesList) // 游戏库页面
}
