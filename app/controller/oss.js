'use strict';

const Controller = require('egg').Controller;
const fs = require('mz/fs');
const path = require('path');
const SysError = require('../common/sys_error');

class OSSController extends Controller {
  /**
   * OSS 客户端 STS 直传模式
   * https://help.aliyun.com/document_detail/31923.html?spm=a2c4g.11186623.6.1739.32f86e02dluuE5
   * @return {Promise<void>}
   */
  async getCredentials() {
    const { app, ctx, config } = this;
    const { bucket } = ctx.request.query;
    if (!bucket) {
      throw new SysError(
        constant.ERROR_MESSAGE.MISSING_OSS_BUCKET,
        constant.ERROR_CODE.MISSING_OSS_BUCKET
      );
    }
    const result = await app.oss.assumeRole(this.config.oss.client.roleArn);
    const credentials = result.credentials;
    const res = ctx.service.oss.createSTSPolicy(
      credentials.Expiration,
      credentials.AccessKeyId,
      credentials.AccessKeySecret,
      config.oss.endpoint,
      bucket
    );
    ctx.body = Object.assign({}, res, { SecurityToken: credentials.SecurityToken });
  }
  /**
   * 文件上传
   * Content-Type: multipart/form-data
   */
  async upload() {
    const { ctx } = this;
    const constant = this.config.constant;
    const files = ctx.request.files;
    const { userId, name } = ctx.me;
    const map = {};
    if (files) {
      for (const file of files) {
        const filename = path.join(
          `${userId}.${name}`,
          path.basename(file.filename)
        );
        let res;
        try {
          res = await ctx.service.oss.put(filename, file.filepath);
        } finally {
          await fs.unlink(file.filepath);
        }
        map[path.basename(file.filename)] = res;
      }
      ctx.body = {
        files: map,
      };
    } else {
      throw new SysError(
        constant.ERROR_MESSAGE.MISSING_FILES,
        constant.ERROR_CODE.MISSING_FILES
      );
    }
  }
}

module.exports = OSSController;
