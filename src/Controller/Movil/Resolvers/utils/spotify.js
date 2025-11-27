
const fetch = require('node-fetch');

let cachedToken = null;
let tokenExpiresAt = 0;

async function getAppToken() {
  const now = Date.now();
  if (cachedToken && now < tokenExpiresAt - 30_000) {
    return cachedToken;
  }

  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', process.env.SPOTIFY_CLIENT_ID);
  params.append('client_secret', process.env.SPOTIFY_CLIENT_SECRET);

  const resp = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Spotify auth failed: ${resp.status} ${text}`);
  }
  const data = await resp.json();
  cachedToken = data.access_token;
  tokenExpiresAt = Date.now() + (data.expires_in * 1000);
  return cachedToken;
}

async function fetchSpotifyCategories({ limit = 40, locale } = {}) {
  const token = await getAppToken();
  const url = new URL('https://api.spotify.com/v1/browse/categories');
  url.searchParams.set('limit', String(limit));
  if (locale) url.searchParams.set('locale', locale);

  const resp = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Spotify categories failed: ${resp.status} ${text}`);
  }
  const data = await resp.json();
  return data.categories.items.map(item => ({
    id: item.id,
    name: item.name,
    imageUrl: item.icons?.[0]?.url || null,
  }));
}

module.exports = { fetchSpotifyCategories };
