/* eslint valid-jsdoc: "off" */

'use strict'
const path = require('path')
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {}
  // 模板配置
  config.view = {
    defaultViewEngine: 'nunjucks',
  }
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1644812574967_9752'

  // add your middleware config here
  // 配置需要的中间件，数组顺序即为中间件的加载顺序
  config.middleware = [ 'requestLog', 'responseTime' ]
  // key 为驼峰格式
  config.responseTime = {
    headerKey: 'X-Response-Time',
    // match: '/api',  // 匹配到的api
  }
  // 链接redis
  config.redis = {
    client: {
      port: 6379, // redis端口号
      host: '127.0.0.1',
      password: '', // 无密码
      db: 0,
    },
  }
  // add your user config here
  const userConfig = {
    proxy: true, // 打开前置代理模式
    maxIpsCount: 1, // 配置前置的反向代理数量
    cookies: {
      httpOnly: false, // 浏览器js可读
      encrypt: true, // 加密传输
      sameSite: false,
    },
    logger: {
      level: 'INFO', //  日志记录级别
      consoleLevel: 'DEBUG',
    },
    // https://github.com/eggjs/egg-security#options // 更多配置
    // 服务端无法接受post请求，并且前台报错403 ，服务端自动返回信息：message: 'invalid csrf token'。
    // 因为egg 框架内置了安全系统，默认开启防止 XSS 攻击 和 CSRF 攻击，可以通过关闭 CSRF 方式解决（不推荐）
    security: { // 解决post请求报错invalid csrf token 问题
      csrf: {
        enable: false, // 是否开启
        // type: 'referer',
        // refererWhiteList: [ 'http://127.0.0.1:9527/' ], // 貌似不行？？
      },
      // 允许访问接口的白名单
      // domainWhiteList: [ 'http://127.0.0.1:9527/' ],
    },
    cors: { // 设置允许跨域
      origin: '*',
      // credentials: true,
      allowMethods: 'OPTIONS,GET,HEAD,PUT,POST,DELETE,PATCH',
    },
    // "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTksIndfaWQiOiJaaG91SHVhbiIsInVzZXJuYW1lIjoiMTg4MTkxNjQyNzQiLCJpc19hZG1pbiI6dHJ1ZSwiaWF0IjoxNjQ0ODM0MDAzLCJleHAiOjE2NDU0Mzg4MDN9.Ekyziu52XPnuBeUv4WIX9wz1RkOA_diuB7fk5Oext1Y"
    jwt: {
      secret: 'nJJU8hrfdepHGy8b78', // 用户鉴权用的，自定义 token 的加密条件字符串
      expiresIn: '7d', // 配置默认过期时间
      ignore: [ /^.*(\/register|\/login|\/logout|\/register\/upload|\/common\/statistics|\/nunjucks|\/restfulApiFruits).*$/ ], // 忽略需要token验证的路由
      enable: true, // 默认是不启用
    },
    // 自定义日志
    customLogger: { // 设置自定义日志与requestLog中间件关联
      reqLogger: {
        file: path.join(appInfo.root, `logs/${appInfo.name}/request.log`),
        contextFormatter(meta) {
          return `[${meta.date}] [${meta.ctx.method} ${meta.ctx.url}] ${meta.message}11`
        },
      },
    },

  }

  return {
    ...config,
    ...userConfig,
  }
}
