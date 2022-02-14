'use strict';

const { Controller } = require('egg');
const Qs = require('qs');

class BaseController extends Controller {
  get user() {
    return this.ctx.state.user;
  }
  get Qs() {
    return Qs;
  }

  /**
   * 统一处理包含分页数据的函数
   * @param { Object } Object qs后的接口参数
   * @param { String } Object.query 具体参数qs后的字符串
   * @return { Object } 返回分页数据和其他参数
   */
  paginationDeal({ query }) {
    // page: 页面；size: 分页数; allData: 查询所有数据，不分页; params: 其他参数
    const { page = 1, size = 10, allData = 0, ...params } = Qs.parse(query);
    const offset = (page - 1) * size;
    const limit = Number(size);
    return allData ? { ...params } : { limit, offset, ...params };
  }

  /**
   * 公用返回成功结果的函数
   * @param { Object } Object 成功结果数据
   * @param { Number } Object.status http状态码
   * @param { Number } Object.code 业务code 状态码
   * @param { String } Object.msg 结果信息
   * @param { any } Object.data 返回的数据
   */
  success({ status = 200, code = 0, msg = 'success', data } = {}) {
    this.ctx.body = {
      code,
      msg,
      data,
    };
    this.ctx.status = status;
  }

}

module.exports = BaseController;
