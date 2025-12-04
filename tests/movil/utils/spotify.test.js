jest.mock('node-fetch', () => jest.fn());

const fetch = require('node-fetch');
const { fetchSpotifyCategories } = require('../../../src/Controller/Movil/Resolvers/utils/spotify');

describe('fetchSpotifyCategories (Spotify utils)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.SPOTIFY_CLIENT_ID = 'fake-id';
    process.env.SPOTIFY_CLIENT_SECRET = 'fake-secret';
  });

  test('debe devolver categorías correctamente', async () => {
    // 1) Mock auth OK
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        access_token: 'fake_token',
        expires_in: 3600,
      }),
      text: async () => '',
    });

    // 2) Mock categorías OK
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        categories: {
          items: [
            {
              id: 'pop',
              name: 'Pop',
              icons: [{ url: 'image_url_pop' }],
            },
            {
              id: 'rock',
              name: 'Rock',
              icons: [],
            },
          ],
        },
      }),
      text: async () => '',
    });

    const result = await fetchSpotifyCategories({ limit: 50 });

    expect(result).toEqual([
      { id: 'pop', name: 'Pop', imageUrl: 'image_url_pop' },
      { id: 'rock', name: 'Rock', imageUrl: null },
    ]);

    expect(fetch).toHaveBeenCalledTimes(2);
  });
});
