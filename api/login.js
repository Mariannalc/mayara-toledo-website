const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// In-memory rate limit store: { ip: { count, resetAt } }
const rateLimitStore = new Map();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function timingSafeEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) {
    // still do comparison to avoid timing leak on length
    crypto.timingSafeEqual(bufA, Buffer.alloc(bufA.length));
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

function getRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);
  if (!entry || now > entry.resetAt) {
    return { count: 0, resetAt: now + WINDOW_MS };
  }
  return entry;
}

function recordFailure(ip) {
  const entry = getRateLimit(ip);
  entry.count += 1;
  rateLimitStore.set(ip, entry);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    'unknown';

  // Check rate limit
  const limit = getRateLimit(ip);
  if (limit.count >= MAX_ATTEMPTS) {
    const retryAfter = Math.ceil((limit.resetAt - Date.now()) / 1000);
    res.setHeader('Retry-After', String(retryAfter));
    return res.status(429).json({ error: 'Too many attempts. Try again later.' });
  }

  const { email, password } = req.body || {};

  const validEmail = timingSafeEqual(email || '', process.env.ADMIN_EMAIL || '');
  const validPassword = timingSafeEqual(password || '', process.env.ADMIN_PASSWORD || '');

  if (!validEmail || !validPassword) {
    recordFailure(ip);
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ admin: true }, process.env.JWT_SECRET, { expiresIn: '8h' });

  res.setHeader(
    'Set-Cookie',
    `session=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=28800`
  );

  return res.status(200).json({ ok: true });
};

// Exposed for test resets only
module.exports._resetRateLimit = () => rateLimitStore.clear();
