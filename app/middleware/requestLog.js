'use strict'

module.exports = () => {
  /**
   * 请求日志打印
   * 日志格式 [时间] [请求方式 请求url] ip; userId; userName; query; data;`
   * @param { Object } ctx 执行上下文
   * @param { Function } next 中间件通行执行的方法
   */
  return async function requestLog(ctx, next) {
    const reqLogger = ctx.getLogger('reqLogger')
    const { user } = ctx.state
    try {
      reqLogger.info(666666666666666)
      reqLogger.info(`ip: ${ctx.request.ip}; ${user ? `userId: ${user.id}; userName: ${user.name};` : ''} query: ${JSON.stringify(ctx.request.query)}; data: ${JSON.stringify(ctx.request.body)};`)
    } catch (e) {
      reqLogger.info('日志打印出错')
    }
    await next()
  }

}
