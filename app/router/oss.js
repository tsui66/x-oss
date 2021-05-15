'use strict';


/**
 * @param {Egg.Application} app - egg application
 */

module.exports = app => {
  const { controller } = app;
  return [
    // 获取阿里云 oss 临时上传凭证
    {
      method: 'get',
      path: '/oss/credentials',
      middleware: [],
      controller: controller.oss.getCredentials,
    },
    /**
     * 文件上传
     * Content-Type: multipart/form-data
     */
    {
      method: 'post',
      path: '/oss/upload',
      middleware: [],
      controller: controller.oss.upload,
    },
  ];
};
