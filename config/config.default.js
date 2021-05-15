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

  config.cluster = {
    listen: {
      port: 9060,
    },
  };
  config.constant = require('../app/common/constant');

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1575341322595_1030';

  // add your middleware config here
  config.middleware = [];

  config.jwt = { // 令牌配置项
    secret: 'x_oss_2021#',
  };
 
  config.router = {
    prefix: '/api/',
  };

  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };


  config.logger = {
    dir: './logs/', // 打印目录重定向
    outputJSON: true, // json格式输出
  };

  config.multipart = {
    mode: 'file',
    fileSize: '50mb', // 接收文件大小
    whitelist: [ // 允许接收的文件类型
      '.png',
      '.jpg',
      '.json',
    ],
  };
  config.defaultOperator = '15112345678';

  config.oss = {
    client: {
      sts: true,
      accessKeyId: '',
      accessKeySecret: '',
      roleArn: process.env.ALI_SDK_STS_ROLE, // 'acs:ram::<account id>:role/<role name>',
      region: 'oss-cn-hangzhou',
      timeout: '60s',
    },
    region: 'oss-cn-hangzhou',
    endpoint: 'oss-cn-hangzhou.aliyuncs.com',
    accessKeyId: '',
    accessKeySecret: '',
    timeout: '60s',
  };

  config.security = {
    csrf: {
      enable: false,
    },
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
