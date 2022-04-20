'use strict'

/**
 * Request 对象和 Koa 的 Request 对象相同，是 请求级别 的对象，它提供了大量请求相关的属性和方法供使用。
 * 访问方式
    ctx.request;
    ctx 上的很多属性和方法都被代理到 request 对象上，对于这些属性和方法使用 ctx 和使用 request 去访问它们是等价的，例如 ctx.url === ctx.request.url。
 * 扩展方式
    框架会把 app/extend/request.js 中定义的对象与内置 request 的 prototype 对象进行合并，在处理请求时会基于扩展后的 prototype 生成 request 对象。

*/
module.exports = {
  get foo() {
    return this.get('x-request-foo')
  },
}
