// app/schedule/demo.js
// https://developer.work.weixin.qq.com/document/path/91770
'use strict'
module.exports = {
  schedule: {
    // interval: '1m', // 1 分钟间隔
    cron: '0 30 12 * * *', // 每天上午8点55分
    type: 'all', // 类型 worker-每台机器上只有一个 worker 会执行这个定时任务，每次执行定时任务的 worker 的选择是随机的。 all-每台机器上的每个 worker 都会执行这个定时任务。
    // immediate: true, // 配置了该参数为 true 时，这个定时任务会在应用启动并 ready 后立刻执行一次这个定时任务。
    // disable: false, // 配置该参数为 true 时，这个定时任务不会被启动。
    // env: [ 'local', 'prod' ], // 数组，仅在指定的环境下才启动该定时任务。
  },
  async task(ctx) {
    const data = {
      // 要发送的数据。将自动进行字符串化
      // 当前自定义机器人支持文本（text）、markdown（markdown）、图片（image）、图文（news）四种消息类型。
      // 机器人的text/markdown类型消息支持在content中使用<@userid>扩展语法来@群成员
      msgtype: 'text',
      text: {
        // 文本内容，最长不超过2048个字节，必须是utf8编码
        content: '开饭啦～开饭啦～',
        // userid的列表，提醒群中的指定成员(@某个成员)，@all表示提醒所有人，如果开发者获取不到userid，可以使用mentioned_mobile_list
        // mentioned_list: [ '@严燕姗' ],
        // 手机号列表，提醒手机号对应的群成员(@某个成员)，@all表示提醒所有人
        mentioned_mobile_list: [ '18078867862', '@all' ],
      },
    }
    // 替换为自己添加的机器人webHook
    const webHook = 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=3c950aec-3c22-4fcb-8233-c9a62f5abc30'
    const result = await ctx.curl(webHook, {
      method: 'POST', // 请求方法，默认为GET。可以是GET，POST，DELETE或PUT
      data,
      dataType: 'json', // 字符串-响应数据的类型。可能是text或json
      headers: { // 请求标头
        'Content-Type': 'application/json',
      },
      // timeout: '', // 请求超时
      // auth: '', // username:password在HTTP基本授权中使用
      // gzip: '', // 让您在请求连接时获取res对象，默认为false
    })
    const success = result && result.data && result.data.errcode === 0
    console.log(success ? '发送成功' : `发送失败：${result.data.errcode} --- ${result.data.errmsg}`)
  },
}
