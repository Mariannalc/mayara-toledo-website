const { createMocks } = require('node-mocks-http');

const handler = require('../api/logout');

describe('POST /api/logout', () => {
  test('clears session cookie', async () => {
    const { req, res } = createMocks({ method: 'POST' });

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    const setCookie = res.getHeader('Set-Cookie');
    expect(setCookie).toMatch(/session=/);
    expect(setCookie).toMatch(/Max-Age=0/);
  });
});
