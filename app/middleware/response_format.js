/**
 * response 格式化中间件
 */
'use strict';

const SysError = require('../common/sys_error');

module.exports = () => {
  return async (ctx, next) => {
    try {
      await next();
      if (ctx.status === 404) {
        throw new SysError(`path ${ctx.path} not found`, '404');
      }

      if (Buffer.isBuffer(ctx.body) || ctx.type === 'application/zip') {
        return;
      }

      if (ctx.responseType !== 'file') {
        ctx.body = {
          code: 0,
          success: true,
          data: ctx.body,
          message: null,
        };
      }
    } catch (err) {
      console.log(err);
      ctx.status = err.status || 200;
      ctx.logger.error('[server warn]: ', ctx.request.method, ctx.request.originalUrl, ctx.status || 500, ctx.reqParam, err);

      if (err instanceof SysError) {
        ctx.body = {
          code: err.code || 0,
          success: false,
          data: null,
          message: err.message,
        };
      } else {
        ctx.body = {
          code: 0,
          success: false,
          data: null,
          message: ctx.app.errMsg.SERVER_ERROR,
        };
      }
    }
  };
};
