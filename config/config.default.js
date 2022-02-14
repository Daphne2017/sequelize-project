/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};
  // 模板配置
  config.view = {
    defaultViewEngine: 'nunjucks',
  };
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1644812574967_9752';

  // add your middleware config here
  config.middleware = [ 'requestLog' ];

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
      level: 'INFO',
      consoleLevel: 'DEBUG',
    },
    security: {
      csrf: {
        enable: false,
        ignoreJSON: false,
      },
    },
    cors: { // 设置跨域
      origin: '*',
      // credentials: true,
      allowMethods: 'OPTIONS,GET,HEAD,PUT,POST,DELETE,PATCH',
    },
    jwt: {
      secret: 'nJJU8hrfdepHGy8b78',
      // ignore: [ /^.*().*$/ ],
      enable: true, // 默认是不启用的。。坑爹啊。。
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
