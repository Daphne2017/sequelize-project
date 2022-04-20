/**
  官网：https://www.eggjs.org/zh-CN/basics/app-start
  我们常常需要在应用启动期间进行一些初始化工作，等初始化完成后应用才可以启动成功，并开始对外提供服务。
  框架提供了统一的入口文件（app.js）进行启动过程自定义，这个文件返回一个 Boot 类，我们可以通过定义 Boot 类中的生命周期方法来执行启动应用过程中的初始化工作。
  框架提供了这些 生命周期函数供开发人员处理：
    * 配置文件即将加载，这是最后动态修改配置的时机（configWillLoad）
    * 配置文件加载完成（configDidLoad）
    * 文件加载完成（didLoad）
    * 插件启动完毕（willReady）
    * worker 准备就绪（didReady）
    * 应用启动完成（serverDidReady）
    * 应用即将关闭（beforeClose）
  注意：在自定义生命周期函数中不建议做太耗时的操作，框架会有启动的超时检测。
  若想要具体了解整个 Loader 原理以及生命周期的完整函数版本，请参考加载器(https://www.eggjs.org/zh-CN/advanced/loader)和启动自定义(https://www.eggjs.org/zh-CN/basics/app-start)
*/

'use strict'

const path = require('path')
const Cache = require('js-cache')
// app.js
class AppBootHook {
  constructor(app) {

    this.app = app
    // app上面我们可以挂载一些全局的方法和对象
    app.cache = new Cache()

    /**
       在框架运行时，会在 Application 实例上触发一些事件，应用开发者或者插件开发者可以监听这些事件做一些操作。作为应用开发者，我们一般会在启动自定义脚本中进行监听。
        server: 该事件一个 worker 进程只会触发一次，在 HTTP 服务完成启动后，会将 HTTP server 通过这个事件暴露出来给开发者。
        error: 运行时有任何的异常被 onerror 插件捕获后，都会触发 error 事件，将错误对象和关联的上下文（如果有）暴露给开发者，可以进行自定义的日志记录上报等处理。
        request 和 response: 应用收到请求和响应请求时，分别会触发 request 和 response 事件，并将当前请求上下文暴露出来，开发者可以监听这两个事件来进行日志记录。
    */

    app.once('server', server => {
      // console.log('HTTP server 事件触发', server)
    })
    app.on('error', (err, ctx) => {
      // console.log('应用运行异常error ===', err)
      // console.log('应用运行异常ctx ===', ctx)
    })
    app.on('request', ctx => {
      // console.log('应用接收到请求了', ctx)
    })
    app.on('response', ctx => {
      // ctx.starttime is set by framework
      // console.log('应用响应请求了', ctx)
      const used = Date.now() - ctx.starttime
      // console.log('used === ', used)
    })

  }
  configWillLoad() {
    /**
      此时 config 文件已经被读取并合并，但是还并未生效
      这是应用层修改配置的最后时机
      注意：此函数只支持同步调用

      例如：参数中的密码是加密的，在此处进行解密
      this.app.config.mysql.password = decrypt(this.app.config.mysql.password)
      例如：插入一个中间件到框架的 coreMiddleware 之间
      const statusIdx = this.app.config.coreMiddleware.indexOf('status')
      this.app.config.coreMiddleware.splice(statusIdx + 1, 0, 'limit')
    */
  }

  async didLoad() {
    /**
      所有的配置已经加载完毕
      可以用来加载应用自定义的文件，启动自定义的服务
      例如：加载自定义的目录
      this.app.loader.loadToContext(path.join(__dirname, 'app/tasks'), 'tasks', {  // loadToContext 是加载到 ctx 上
        fieldClass: 'tasksClasses',
      })
    */
    const directory = path.join(this.app.config.baseDir, 'utils')
    this.app.loader.loadToApp(directory, 'utils') // 用于加载一个目录下的文件到 app,在controller和service中可以使用this.app.utiil读取自定义目录
  }

  async willReady() {
    /**
      所有的插件都已启动完毕，但是应用整体还未 ready
      可以做一些数据初始化等操作，这些操作成功才会启动应用
      例如：从数据库加载数据到内存缓存
      this.app.cacheData = await this.app.model.query(QUERY_CACHE_SQL)
    */

  }

  async didReady() {
    // this.app.config.coreMiddleware.unshift('responseTime') // 在中间件最前面统计请求时间
    /**
      应用已经启动完毕
      const ctx = await this.app.createAnonymousContext()
      await ctx.service.Biz.request()
    */

  }

  async serverDidReady() {
    /**
      http / https server 已启动，开始接受外部请求
      此时可以从 app.server 拿到 server 的实例
    */
    this.app.server.on('timeout', socket => {
      console.log(socket)
      // handle socket timeout
    })
  }
  async beforeClose() {
    // console.log('beforeClose')
  }
}

module.exports = AppBootHook

/**
 *  旧版本Egg 框架的生命周期函数
 module.exports = app => {
  app.ready(async () => {  // 用willReady()替代
  });
  app.beforeStart(async () => { // 用didReady替代
  })
  app.beforeClose(async () => { // beforeClose替代
  });
}
*/

