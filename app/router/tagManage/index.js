'use strict'

/**
 * @param {Egg.Application} app - egg application
 */

module.exports = ({
  router,
  controller: {
    tagManage: {
      tagLibrary,
    },
  },
}) => {

  /** 标签库*/
  router.get('/tagManagement/tagLibraryList', tagLibrary.getTagList) // 获取标签库
  router.post('/tagManagement/tagLibraryList/add', tagLibrary.addTag) // 新增标签库
  router.put('/tagManagement/tagLibraryList/edit/:id', tagLibrary.eidtTag) // 编辑
  router.patch('/tagManagement/tagLibraryList/updatePutStatus/:id', tagLibrary.updatePutStatus) // 标签上下架
  router.patch('/tagManagement/tagLibraryList/updateWeight/:id', tagLibrary.updateWeight) // 标签权重
  router.get('/tagManagement/tagLibraryList/getRelatedGameByTagId/:tagId', tagLibrary.getRelatedGamesByTagId) // 通过tagId获取关联游戏


}
