const jwt = require('jsonwebtoken');
const { put, head } = require('@vercel/blob');

const BLOB_KEY = 'mayara-settings.json';

function computeMode(settings) {
  if (settings?.forced === 'OPEN')   return 'OPEN';
  if (settings?.forced === 'CLOSED') return 'WAITLIST';
  if (!settings || (!settings.open_at && !settings.close_at)) return 'ALWAYS_OPEN';
  const now = Date.now();
  const open = settings.open_at ? new Date(settings.open_at).getTime() : null;
  const close = settings.close_at ? new Date(settings.close_at).getTime() : null;
  if (open && now < open) return 'WAITLIST';
  if (close && now > close) return 'WAITLIST';
  return 'OPEN';
}

async function readSettings() {
  try {
    const meta = await head(BLOB_KEY);
    const res = await fetch(meta.url);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function verifyAuth(req) {
  const cookie = req.cookies?.session || req.headers?.cookie?.match(/session=([^;]+)/)?.[1];
  if (!cookie) return null;
  try {
    return jwt.verify(cookie, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    const settings = await readSettings();
    const mode = computeMode(settings);
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    return res.status(200).json({
      open_at: settings?.open_at || null,
      close_at: settings?.close_at || null,
      forced: settings?.forced || null,
      mentoria_text: settings?.mentoria_text || null,
      mode,
    });
  }

  if (req.method === 'POST') {
    const auth = verifyAuth(req);
    if (!auth) return res.status(401).json({ error: 'Unauthorized' });

    const { open_at, close_at, forced, mentoria_text } = req.body || {};

    if (
      (open_at && isNaN(new Date(open_at).getTime())) ||
      (close_at && isNaN(new Date(close_at).getTime()))
    ) {
      return res.status(400).json({ error: 'Invalid datetime format' });
    }

    if (forced !== undefined && forced !== null && forced !== 'OPEN' && forced !== 'CLOSED') {
      return res.status(400).json({ error: 'Invalid forced value' });
    }

    const data = { open_at: open_at || null, close_at: close_at || null, forced: forced || null, mentoria_text: mentoria_text || null };
    await put(BLOB_KEY, JSON.stringify(data), {
      access: 'public',
      contentType: 'application/json',
      allowOverwrite: true,
      addRandomSuffix: false,
    });

    return res.status(200).json({ ...data, mode: computeMode(data) });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
