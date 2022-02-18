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
  router.post('/gameMangement/gameLibrary/add', gameLibrary.addGameSubmit) // 新增游戏
  router.put('/gameMangement/gameLibrary/edit/:id', gameLibrary.editGameSubmit) // 编辑游戏

}
