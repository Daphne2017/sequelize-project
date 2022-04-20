'use strict'
const BAR = Symbol('Application#bar')
/**
 * Application 是 Koa 的全局应用对象，在一个应用中，只会实例化一个，它继承自 Koa.Application，在它上面我们可以挂载一些全局的方法和对象。我们可以轻松的在插件或者应用中扩展 Application 对象。
 * 框架会把 app/extend/application.js 中定义的对象与 Koa Application 的 prototype 对象进行合并，在应用启动时会基于扩展后的 prototype 生成 app 对象。
 * 事件：在框架运行时，会在 Application 实例上触发一些事件，应用开发者或者插件开发者可以监听这些事件做一些操作。作为应用开发者，我们一般会在启动自定义脚本中（app.js）进行监听。
 * 访问方式
    ctx.app
    Controller，Middleware，Helper，Service 中都可以通过 this.app 访问到 Application 对象，例如 this.app.config 访问配置对象。
    在 app.js 中 app 对象会作为第一个参数注入到入口函数中
 * 扩展方式
   框架会把 app/extend/application.js 中定义的对象与 Koa Application 的 prototype 对象进行合并，在应用启动时会基于扩展后的 prototype 生成 app 对象
 */
module.exports = {
  foo(param) {
    // this 就是 app 对象，在其中可以调用 app 上的其他方法，或访问属性
  },
  // 属性扩展：一般来说属性的计算在同一次请求中只需要进行一次，那么一定要实现缓存，否则在同一次请求中多次访问属性时会计算多次，这样会降低应用性能。推荐的方式是使用 Symbol + Getter 的模式。
  get bar() {
    if (!this[BAR]) {
      // 实际情况肯定更复杂
      this[BAR] = this.config.xx + this.config.yy
    }
    return this[BAR]
  },
}
