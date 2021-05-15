'use strict';

const fs = require('fs');
const path = require('path');

/**
 * @param {Egg.Application} app - egg application
 */

module.exports = app => {
  const { router, config } = app;
  router.prefix(config.router.prefix);
  // 聚合路由
  const files = fs.readdirSync(path.join(__dirname, '/router'));
  files.forEach(file => {
    const routers = require(path.join(__dirname, `/router/${file}`))(app);
    routers.forEach(item => {
      router[item.method](item.path, ...item.middleware, item.controller);
    });
  });

  return router;
};
