// app/extend/helper.js
'use strict'

/**
 * Helper 函数用来提供一些实用的 utility 函数。
 * 它的作用在于我们可以将一些常用的动作抽离在 helper.js 里面成为一个独立的函数，这样可以用 JavaScript 来写复杂的逻辑，避免逻辑分散各处。另外还有一个好处是 Helper 这样一个简单的函数，可以让我们更容易编写测试用例。
 * 框架内置了一些常用的 Helper 函数。我们也可以编写自定义的 Helper 函数。
 * 框架默认提供以下 Helper 方法
    pathFor(name, params): 生成对应[路由]的 path 路径。
    urlFor(name, params): 生成对应[路由]的 URL。
    shtml() / sjs() / ...: 由安全组件提供的安全方法。
 * 访问方式
    通过 ctx.helper 访问到 helper 对象，例如：在 Controller 中使用 ctx.helper.pathFor('home', { by: 'recent', limit: 20 })/;
 * 扩展方式
    框架会把 app/extend/helper.js 中定义的对象与内置 helper 的 prototype 对象进行合并，在处理请求时会基于扩展后的 prototype 生成 helper 对象。
*/
module.exports = {
  foo(param) {
    // this 是 helper 对象，在其中可以调用其他 helper 方法
    // this.ctx => context 对象
    // this.app => application 对象
  },
  formatUser(user) {
  },
  /*
  * 下划线转小驼峰
  * 用法：this.ctx.helper.toHumpFun(obj)
  */
  toHumpFun(obj) {
    const result = (Array.isArray(obj) ? [] : {})
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const element = obj[key]
        const index = key.indexOf('_')
        let newKey = key
        if (index === -1 || key.length === 1) {
          result[key] = element
        } else {
          const keyArr = key.split('_')
          const newKeyArr = keyArr.map((item, index) => {
            if (index === 0) return item
            return item.charAt(0).toLocaleUpperCase() + item.slice(1)
          })
          newKey = newKeyArr.join('')
          result[newKey] = element
        }

        // element instanceof Date 判断日期格式不做转换，否则日期格式会变成 "{}"
        if (typeof element === 'object' && element !== null && !(element instanceof Date)) {
          result[newKey] = this.toHumpFun(element)
        }
      }
    }
    return result
  },
}
