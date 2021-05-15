'use strict';
const { app, assert } = require('egg-mock/bootstrap');

describe('oss', () => {
  it('should GET /oss/credentials', () => {
    return app.httpRequest()
      .get('/api/v1/oss/credentials')
      .expect(200);
  });
});
