'use strict'

/**
 * Context 是一个请求级别的对象，继承自 Koa.Context。在每一次收到用户请求时，框架会实例化一个 Context 对象，这个对象封装了这次用户请求的信息，并提供了许多便捷的方法来获取请求参数或者设置响应信息。
 * 框架会将所有的 Service 挂载到 Context 实例上，一些插件也会将一些其他的方法和对象挂载到它上面（egg-sequelize 会将所有的 model 挂载在 Context 上）。
 * 有些非用户请求的场景下（例如，app.js中）我们需要访问 service / model 等 Context 实例上的对象，我们可以通过 Application.createAnonymousContext() 方法创建一个匿名 Context 实例，
 * 在定时任务中的每一个 task 都接受一个 Context 实例作为参数，以便我们更方便的执行一些定时的业务逻辑。
 * 访问方式
    middleware 中 this 就是 ctx，例如 this.cookies.get('foo')。
    controller 有两种写法，类的写法通过 this.ctx，方法的写法直接通过 ctx 入参。
    helper，service 中的 this 指向 helper，service 对象本身，使用 this.ctx 访问 context 对象，例如 this.ctx.cookies.get('foo')。
 * 扩展方式
    框架会把 app/extend/context.js 中定义的对象与 Koa Context 的 prototype 对象进行合并，在处理请求时会基于扩展后的 prototype 生成 ctx 对象。
*/
const BAR = Symbol('Context#bar')
module.exports = {
  // 方法扩展
  foo(param) { 
  },
  // 属性扩展：一般来说属性的计算在同一次请求中只需要进行一次，那么一定要实现缓存，否则在同一次请求中多次访问属性时会计算多次，这样会降低应用性能。推荐的方式是使用 Symbol + Getter 的模式。
  get bar() {
    // this 就是 ctx 对象，在其中可以调用 ctx 上的其他方法，或访问属性
    if (!this[BAR]) {
      // 例如，从 header 中获取，实际情况肯定更复杂
      this[BAR] = this.get('x-bar')
    }
    return this[BAR]
  },
  /**
   * 判断是否为系统管理员
   * @param {Context} ctx Egg Context
   */
  async isAdminManager(ctx) {
    const token = ctx.request.headers.authorization.split(' ')[1]
    const { isAdmin } = await ctx.app.redis.hgetall(token)
    return Boolean(+isAdmin)
  },

}
