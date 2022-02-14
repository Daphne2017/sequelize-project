'use strict';

const nowMode = 'local';
// const nowMode = 'alpha'
// const nowMode = 'tmp'

const mysqlConfigMap = {
  local: {
    username: 'root',
    password: 'root',
    host: '127.0.0.1',
    port: 3306,
  },
  alpha: {
    username: 'root',
    password: '12345678',
    host: '192.168.2.101',
    port: 3307,
  },
  tmp: {
    username: 'huoxing',
    host: '127.0.0.1',
    password: 'djsh#d12',
    port: 3388,
  },
};

const dataBaseMap = {
  local: {
    database: 'egg_dev',
  },
  alpha: {
    database: 'huoxing',
  },
  tmp: {
    database: 'hx_game_tmp',
  },
};

const dataBaseLogMap = {
  local: {
    database: 'huoxing_log',
  },
  alpha: {
    database: 'huoxing_log',
  },
  tmp: {
    database: 'hx_game_log_tmp',
  },
};

const mysqlBaseConfig = {
  dialect: 'mysql',
  ...mysqlConfigMap[nowMode],
  timezone: '+08:00',
  define: {
    freezeTableName: true, // 防止修改表名为复数
    underscored: true, // 防止驼峰式字段被默认转为下划线
  },
};
// 数据库的配置
module.exports = () => {
  return {
    sequelize: {
      datasources: [{
        delegate: 'model',
        baseDir: 'model',
        ...dataBaseMap[nowMode],
        ...mysqlBaseConfig,
      }, {
        delegate: 'modelLog',
        baseDir: 'model_log',
        ...dataBaseLogMap[nowMode],
        ...mysqlBaseConfig,
      }],
    },
  };
};
