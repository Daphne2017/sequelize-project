'use strict'

/**
 * Response 对象和 Koa 的 Response 对象相同，是 请求级别 的对象，它提供了大量请求相关的属性和方法供使用。
 * 访问方式
    ctx.response;
    ctx 上的很多属性和方法都被代理到 response 对象上，对于这些属性和方法使用 ctx 和使用 response 去访问它们是等价的，例如 ctx.status = 404 和 ctx.response.status = 404 是等价的。
 * 扩展方式
    框架会把 app/extend/response.js 中定义的对象与内置 response 的 prototype 对象进行合并，在处理请求时会基于扩展后的 prototype 生成 response 对象。

*/
// app/extend/response.js
module.exports = {
  set foo(value) {
    this.set('x-response-foo', value)
  },
}
// 就可以这样使用啦：this.response.foo = 'bar';
