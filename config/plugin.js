'use strict'

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  jwt: {
    enable: true,
    package: 'egg-jwt', // 开启token校验
  },
  cors: {
    enable: true,
    package: 'egg-cors', // 开启可跨域
  },
  sequelize: {
    enable: true,
    package: 'egg-sequelize', // 开启egg-sequelize
  },
  validate: {
    enable: true,
    package: 'egg-validate', // 开启校验
  },
  redis: {
    enable: true,
    package: 'egg-redis', // 开启redis
  },
}
