'use strict'
const Subscription = require('egg').Subscription

class ClearCacheTask extends Subscription {

  static get schedule() {
    return {
      cron: '0 0 3 * * *', // 每天3点（统计昨天的数据）
      type: 'worker',
      env: [ 'alpha', 'beta', 'prod' ],
    }
  }

  async subscribe() {
    // 执行日统计数据的任务
    // await this.service.scheduleTask.statisticsTask.cycleStatistics('day', 'common')
  }
}

module.exports = ClearCacheTask
