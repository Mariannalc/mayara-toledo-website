const { createMocks } = require('node-mocks-http');
const jwt = require('jsonwebtoken');

process.env.JWT_SECRET = 'testsecret32byteslong1234567890ab';
process.env.BLOB_READ_WRITE_TOKEN = 'fake-token';

// Mock @vercel/blob
let mockBlobData = null;
jest.mock('@vercel/blob', () => ({
  put: jest.fn(async (key, data) => {
    mockBlobData = data;
    return { url: 'https://fake.blob/' + key };
  }),
  head: jest.fn(async () => {
    if (!mockBlobData) throw new Error('Not found');
    return { url: 'https://fake.blob/mayara-settings.json' };
  }),
}));

// Mock fetch used to read blob content
global.fetch = jest.fn(async () => ({
  ok: true,
  json: async () => (mockBlobData ? JSON.parse(mockBlobData) : null),
}));

const handler = require('../api/settings');

function makeValidToken() {
  return jwt.sign({ admin: true }, process.env.JWT_SECRET, { expiresIn: '8h' });
}

beforeEach(() => {
  mockBlobData = null;
  jest.clearAllMocks();
});

describe('GET /api/settings', () => {
  test('no blob exists → mode is ALWAYS_OPEN', async () => {
    const { head } = require('@vercel/blob');
    head.mockRejectedValueOnce(new Error('Not found'));

    const { req, res } = createMocks({ method: 'GET' });
    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().mode).toBe('ALWAYS_OPEN');
  });

  test('now between open_at and close_at → mode is OPEN', async () => {
    const past = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const future = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    mockBlobData = JSON.stringify({ open_at: past, close_at: future });

    const { req, res } = createMocks({ method: 'GET' });
    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().mode).toBe('OPEN');
  });

  test('now before open_at → mode is WAITLIST', async () => {
    const future1 = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    const future2 = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
    mockBlobData = JSON.stringify({ open_at: future1, close_at: future2 });

    const { req, res } = createMocks({ method: 'GET' });
    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().mode).toBe('WAITLIST');
  });

  test('now after close_at → mode is WAITLIST', async () => {
    const past1 = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    const past2 = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    mockBlobData = JSON.stringify({ open_at: past1, close_at: past2 });

    const { req, res } = createMocks({ method: 'GET' });
    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().mode).toBe('WAITLIST');
  });
});

describe('GET /api/settings — forced override', () => {
  test('forced OPEN → mode is OPEN even with future open_at', async () => {
    const future = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    mockBlobData = JSON.stringify({ open_at: future, close_at: null, forced: 'OPEN' });
    const { req, res } = createMocks({ method: 'GET' });
    await handler(req, res);
    expect(res._getJSONData().mode).toBe('OPEN');
  });

  test('forced CLOSED → mode is WAITLIST regardless of dates', async () => {
    const past = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const future = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    mockBlobData = JSON.stringify({ open_at: past, close_at: future, forced: 'CLOSED' });
    const { req, res } = createMocks({ method: 'GET' });
    await handler(req, res);
    expect(res._getJSONData().mode).toBe('WAITLIST');
  });
});

describe('POST /api/settings', () => {
  test('valid JWT + valid body → 200, blob updated', async () => {
    const token = makeValidToken();
    const open_at = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    const close_at = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();

    const { req, res } = createMocks({
      method: 'POST',
      cookies: { session: token },
      body: { open_at, close_at },
    });
    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().open_at).toBe(open_at);
  });

  test('missing JWT → 401', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: { open_at: new Date().toISOString(), close_at: new Date().toISOString() },
    });
    await handler(req, res);

    expect(res.statusCode).toBe(401);
  });

  test('expired JWT → 401', async () => {
    const expired = jwt.sign({ admin: true }, process.env.JWT_SECRET, { expiresIn: -1 });
    const { req, res } = createMocks({
      method: 'POST',
      cookies: { session: expired },
      body: { open_at: new Date().toISOString(), close_at: new Date().toISOString() },
    });
    await handler(req, res);

    expect(res.statusCode).toBe(401);
  });

  test('invalid datetime format → 400', async () => {
    const token = makeValidToken();
    const { req, res } = createMocks({
      method: 'POST',
      cookies: { session: token },
      body: { open_at: 'not-a-date', close_at: 'also-not-a-date' },
    });
    await handler(req, res);

    expect(res.statusCode).toBe(400);
  });
});
