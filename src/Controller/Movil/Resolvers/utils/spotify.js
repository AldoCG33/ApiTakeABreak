const fetch = require("node-fetch");
require("dotenv").config();

let cachedToken = null;
let tokenExpiresAt = 0;

/**
 * Obtiene token de Spotify usando Client Credentials
 */
async function getAppToken() {
  const now = Date.now();

  if (cachedToken && now < tokenExpiresAt) {
    return cachedToken;
  }

  const authString = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  const resp = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${authString}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Spotify auth failed: ${resp.status} ${text}`);
  }

  const data = await resp.json();

  cachedToken = data.access_token;
  tokenExpiresAt = now + data.expires_in * 1000;

  return cachedToken;
}

/**
 * Obtiene categorías con limit dinámico (PARA QUE TU TEST FUNCIONE)
 */
async function fetchSpotifyCategories({ limit = 20 } = {}) {
  const token = await getAppToken();

  const resp = await fetch(
    `https://api.spotify.com/v1/browse/categories?limit=${limit}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Spotify categories failed: ${resp.status} ${text}`);
  }

  const data = await resp.json();

  if (!data.categories || !Array.isArray(data.categories.items)) {
    return [];
  }

  return data.categories.items.map((item) => ({
    id: item.id,
    name: item.name,
    imageUrl: item.icons?.[0]?.url || null,
  }));
}

module.exports = {
  getAppToken,
  fetchSpotifyCategories,
};
