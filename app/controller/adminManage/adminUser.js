'use strict'

const Controller = require('../baseController')

class adminUserController extends Controller {
  /**
   * 获取用户信息
   */
  async getUserInfo() {
    const userId = this.user.id
    const data = {
      id: userId,
      name: this.user.name,
      avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      roles: [ 'admin' ],
      // ['editor']
      introduction: 'I am a super administrator',
    }
    this.success({ data })
  }
}

module.exports = adminUserController
