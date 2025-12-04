const jwt = require('jsonwebtoken');
const context = require('../../../src/Controller/Movil/Resolvers/context');

jest.mock('jsonwebtoken');

describe('context (middleware de Apollo)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.SECRETA = 'test_secret';
  });

  test('debe devolver { usuarios: null } si no hay header Authorization', async () => {
    const ctx = await context({ req: { headers: {} } });
    expect(ctx).toEqual({ usuarios: null });
  });

  test('debe devolver { usuarios: null } si el header no empieza con Bearer', async () => {
    const ctx = await context({ req: { headers: { authorization: 'Token abc' } } });
    expect(ctx).toEqual({ usuarios: null });
  });

  test('debe devolver { usuarios: null } si el token es inválido', async () => {
    jwt.verify.mockImplementation(() => {
      throw new Error('invalid token');
    });

    const ctx = await context({
      req: { headers: { authorization: 'Bearer fake' } },
    });

    expect(jwt.verify).toHaveBeenCalled();
    expect(ctx).toEqual({ usuarios: null });
  });

  test('debe devolver el usuario decodificado si el token es válido', async () => {
    const fakeUser = { id: '123', email: 'test@test.com' };

    jwt.verify.mockReturnValue(fakeUser);

    const ctx = await context({
      req: { headers: { authorization: 'Bearer valid_token' } },
    });

    expect(jwt.verify).toHaveBeenCalledWith('valid_token', process.env.SECRETA);
    expect(ctx).toEqual({ usuarios: fakeUser });
  });
});
