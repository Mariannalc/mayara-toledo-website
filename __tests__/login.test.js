// Tests for POST /api/login
// Behaviour: valid credentials → 200 + session cookie set

const { createMocks } = require('node-mocks-http');

// Set env vars before requiring the handler
process.env.ADMIN_EMAIL = 'mayara@test.com';
process.env.ADMIN_PASSWORD = 'secret123';
process.env.JWT_SECRET = 'testsecret32byteslong1234567890ab';

const handler = require('../api/login');

describe('POST /api/login', () => {
  beforeEach(() => {
    // Reset rate limit store between tests
    handler._resetRateLimit?.();
  });

  test('valid credentials → 200 and sets session cookie', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: { email: 'mayara@test.com', password: 'secret123' },
      headers: { 'x-forwarded-for': '1.2.3.4' },
    });

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    const setCookie = res.getHeader('Set-Cookie');
    expect(setCookie).toBeDefined();
    expect(setCookie).toMatch(/session=/);
    expect(setCookie).toMatch(/HttpOnly/i);
    expect(setCookie).toMatch(/Secure/i);
  });

  test('invalid password → 401, no cookie', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: { email: 'mayara@test.com', password: 'wrongpassword' },
      headers: { 'x-forwarded-for': '1.2.3.5' },
    });

    await handler(req, res);

    expect(res.statusCode).toBe(401);
    expect(res.getHeader('Set-Cookie')).toBeUndefined();
  });

  test('invalid email → 401, no cookie', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: { email: 'wrong@test.com', password: 'secret123' },
      headers: { 'x-forwarded-for': '1.2.3.6' },
    });

    await handler(req, res);

    expect(res.statusCode).toBe(401);
    expect(res.getHeader('Set-Cookie')).toBeUndefined();
  });

  test('6th failed attempt from same IP → 429 with Retry-After', async () => {
    const ip = '9.9.9.9';
    for (let i = 0; i < 5; i++) {
      const { req, res } = createMocks({
        method: 'POST',
        body: { email: 'wrong@test.com', password: 'wrong' },
        headers: { 'x-forwarded-for': ip },
      });
      await handler(req, res);
    }

    const { req, res } = createMocks({
      method: 'POST',
      body: { email: 'mayara@test.com', password: 'secret123' },
      headers: { 'x-forwarded-for': ip },
    });
    await handler(req, res);

    expect(res.statusCode).toBe(429);
    expect(res.getHeader('Retry-After')).toBeDefined();
  });
});
