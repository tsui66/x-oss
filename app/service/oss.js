'use strict';

const Service = require('egg').Service;
const OSS = require('ali-oss');
const crypto = require('crypto');

class OSSService extends Service {
  constructor(app) {
    super(app);
    const config = this.app.config.oss;
    /**
     * @type {OSS}
     */
    this.client = new OSS(config);
  }

  createSTSClient(accessKeyId, accessKeySecret, stsToken, region, bucket) {
    return new OSS({
      accessKeyId,
      accessKeySecret,
      stsToken,
      region,
      bucket,
      secure: true,
    });
  }
  // 创建临时 oss policy, 用户客户端直传凭证
  createSTSPolicy(expiration, accessKeyId, accessKeySecret, region, bucket) {
    const dirPath = `${bucket}/`;
    let policyString = {
      expiration, // 设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了
      conditions: [
        [ 'content-length-range', 0, 1048576000 ],
        [ 'starts-with', '$key', dirPath ],
      ],
    };
    policyString = JSON.stringify(policyString);
    const policy = new Buffer(policyString).toString('base64');
    const signature = crypto.createHmac('sha1', accessKeySecret).update(policy).digest('base64');
    const new_multipart_params = {
      OSSAccessKeyId: accessKeyId,
      host: `https://${bucket}.${region}`,
      policy,
      signature,
      expiration,
      startsWith: dirPath,
    };
    return new_multipart_params;
  }

  /**
   * Upload file to Aliyun OSS
   * @param {string} path
   * @param {File} file
   * @return {Promise<OSS.PutObjectResult>} OSS result object
   */
  async put(path, file) {
    return await this.client.put(path, file, {
      headers: { 'x-oss-forbid-overwrite': true },
    });
  }

  /**
   * Delete file from Aliyun OSS
   * @param {string} path
   * @return {Promise<OSS.NormalSuccessResponse>}
   */
  async delete(path) {
    return await this.client.delete(path);
  }

  /**
   * Delete file from Aliyun OSS
   * @param {string} path
   * @return {boolean}
   */
  async isExistObject(path) {
    try {
      await this.client.head(path);
      return true;
    } catch (error) {
      if (error.code === 'NoSuchKey') {
        return false;
      }
    }
  }

}
module.exports = OSSService;

