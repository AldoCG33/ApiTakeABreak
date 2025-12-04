jest.mock('../../../src/Data/model/Usuarios');
jest.mock('bcryptjs');
jest.mock('../../../src/Controller/Movil/utils/crearToken', () => jest.fn());
jest.mock('../../../src/Controller/Movil/Resolvers/utils/spotify', () => ({
  fetchSpotifyCategories: jest.fn(),
}));

const Usuarios = require('../../../src/Data/model/Usuarios');
const bcryptjs = require('bcryptjs');
const crearToken = require('../../../src/Controller/Movil/utils/crearToken');
const { fetchSpotifyCategories } = require('../../../src/Controller/Movil/Resolvers/utils/spotify');

const usuarioResolver = require('../../../src/Controller/Movil/Resolvers/usuarioResolver');

describe('usuarioResolver', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Query.obtenerUsuarios', () => {
    test('debe lanzar error si no hay usuario en el contexto', async () => {
      await expect(
        usuarioResolver.Query.obtenerUsuarios(null, null, { usuarios: null })
      ).rejects.toThrow('No autorizado');
    });

    test('debe devolver usuarios filtrados por el id del contexto', async () => {
      const fakeUser = { _id: '123', nombre: 'Juan' };
      Usuarios.find.mockResolvedValue([fakeUser]);

      const result = await usuarioResolver.Query.obtenerUsuarios(
        null,
        null,
        { usuarios: { id: '123' } }
      );

      expect(Usuarios.find).toHaveBeenCalledWith({ _id: '123' });
      expect(result).toEqual([fakeUser]);
    });
  });

  describe('Query.listarSpotifyGeneros', () => {
    test('debe delegar en fetchSpotifyCategories', async () => {
      const fakeCategories = [{ id: 'pop', name: 'Pop', imageUrl: null }];
      fetchSpotifyCategories.mockResolvedValue(fakeCategories);

      const result = await usuarioResolver.Query.listarSpotifyGeneros(
        null,
        { limit: 10, locale: 'es_MX' },
        {}
      );

      expect(fetchSpotifyCategories).toHaveBeenCalledWith({ limit: 10, locale: 'es_MX' });
      expect(result).toEqual(fakeCategories);
    });
  });

  describe('Mutation.crearUsuarios', () => {
    test('debe lanzar error si el usuario ya existe', async () => {
      Usuarios.findOne.mockResolvedValue({ email: 'test@test.com' });

      await expect(
        usuarioResolver.Mutation.crearUsuarios(null, {
          input: { email: 'test@test.com', password: '123456' },
        })
      ).rejects.toThrow('El usuario ya esta registrado');
    });

    test('debe crear usuario nuevo y devolver mensaje', async () => {
      const saveMock = jest.fn();
      Usuarios.findOne.mockResolvedValue(null);
      bcryptjs.genSalt.mockResolvedValue('salt');
      bcryptjs.hash.mockResolvedValue('hashedPassword');
      Usuarios.mockImplementation((input) => ({
        ...input,
        save: saveMock,
      }));

      const msg = await usuarioResolver.Mutation.crearUsuarios(null, {
        input: { email: 'test@test.com', password: '123456' },
      });

      expect(bcryptjs.genSalt).toHaveBeenCalledWith(10);
      expect(bcryptjs.hash).toHaveBeenCalledWith('123456', 'salt');
      expect(saveMock).toHaveBeenCalled();
      expect(msg).toBe('Usuario Creado Correctamente');
    });
  });

  describe('Mutation.autenticarUsuarios', () => {
    test('debe lanzar error si el usuario no existe', async () => {
      Usuarios.findOne.mockResolvedValue(null);

      await expect(
        usuarioResolver.Mutation.autenticarUsuarios(null, {
          input: { email: 'test@test.com', password: '123456' },
        })
      ).rejects.toThrow('El usuario no existe');
    });

    test('debe lanzar error si la contraseña es incorrecta', async () => {
      Usuarios.findOne.mockResolvedValue({ email: 'test@test.com', password: 'hash' });
      bcryptjs.compare.mockResolvedValue(false);

      await expect(
        usuarioResolver.Mutation.autenticarUsuarios(null, {
          input: { email: 'test@test.com', password: 'wrong' },
        })
      ).rejects.toThrow('Contraseña incorrecta');
    });

    test('debe devolver token si las credenciales son correctas (regresión)', async () => {
      const fakeUser = { _id: '1', email: 'test@test.com', password: 'hash' };
      Usuarios.findOne.mockResolvedValue(fakeUser);
      bcryptjs.compare.mockResolvedValue(true);
      crearToken.mockReturnValue('fake_jwt_token');

      const result = await usuarioResolver.Mutation.autenticarUsuarios(null, {
        input: { email: 'test@test.com', password: '123456' },
      });

      expect(crearToken).toHaveBeenCalled();
      expect(result).toEqual({ token: 'fake_jwt_token' });
    });
  });

  describe('Mutation.actualizarPreferenciasUsuario', () => {
    test('debe lanzar error si no hay usuario en el contexto', async () => {
      await expect(
        usuarioResolver.Mutation.actualizarPreferenciasUsuario(
          null,
          { input: { generos: ['rock'] } },
          { usuarios: null }
        )
      ).rejects.toThrow('No autorizado');
    });

    test('debe actualizar sólo los campos enviados (regresión)', async () => {
      const fakeUpdatedUser = {
        _id: '123',
        preferences: { generos: ['rock'], autores: ['Autor X'] },
      };

      Usuarios.findByIdAndUpdate.mockResolvedValue(fakeUpdatedUser);

      const result = await usuarioResolver.Mutation.actualizarPreferenciasUsuario(
        null,
        { input: { generos: ['rock'] } },
        { usuarios: { id: '123' } }
      );

      expect(Usuarios.findByIdAndUpdate).toHaveBeenCalledWith(
        '123',
        { $set: { 'preferences.generos': ['rock'] } },
        { new: true }
      );
      expect(result).toBe(fakeUpdatedUser);
    });
  });
});
