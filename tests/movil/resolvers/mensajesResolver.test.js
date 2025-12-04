jest.mock('mongoose', () => {
  const mockSchema = function () {
    return {};
  };

  mockSchema.Types = {
    ObjectId: function () {}
  };

  return {
    Schema: mockSchema,
    Types: {
      ObjectId: { isValid: jest.fn() }
    }
  };
});

jest.mock('../../../src/Data/model/ChatMovil', () => ({
  find: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  create: jest.fn()
}));

const ChatbotMovil = require('../../../src/Data/model/ChatMovil');
const mensajesResolver = require('../../../src/Controller/Movil/Resolvers/mensajesResolver');
const mongoose = require('mongoose');

describe('mensajesResolver', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const ctx = { usuarios: { id: '123' } };

  test('debe fallar si no hay usuario en contexto', async () => {
    await expect(
      mensajesResolver.Mutation.guardarMensajesChat(
        {},
        { input: { mensaje: [{ rol: 'user', texto: 'hola' }] } },
        { usuarios: null }
      )
    ).rejects.toThrow('No autorizado');
  });

  test('debe fallar si input.mensaje está vacío', async () => {
    await expect(
      mensajesResolver.Mutation.guardarMensajesChat(
        {},
        { input: { mensaje: [] } },
        ctx
      )
    ).rejects.toThrow('Debe proporcionar al menos un mensaje');
  });

  test('debe crear una nueva conversación si conversationId es inválido', async () => {
    mongoose.Types.ObjectId.isValid.mockReturnValue(false);

    const fakeConversation = { id: '1', usuarioId: '123', mensaje: [] };
    ChatbotMovil.create.mockResolvedValue(fakeConversation);

    const result = await mensajesResolver.Mutation.guardarMensajesChat(
      {},
      {
        input: {
          mensaje: [
            { rol: 'user', texto: 'hola', emotion: null }
          ]
        },
        conversationId: 'invalid'
      },
      ctx
    );

    expect(ChatbotMovil.create).toHaveBeenCalled();
    expect(result).toEqual(fakeConversation);
  });

  test('debe actualizar conversación existente si el ID es válido (regresión)', async () => {
    mongoose.Types.ObjectId.isValid.mockReturnValue(true);

    const fakeUpdated = { id: '1', usuarioId: '123', mensaje: [] };
    ChatbotMovil.findByIdAndUpdate.mockResolvedValue(fakeUpdated);

    const result = await mensajesResolver.Mutation.guardarMensajesChat(
      {},
      {
        input: {
          mensaje: [
            { rol: 'user', texto: 'hola', emotion: null }
          ]
        },
        conversationId: 'valid_id'
      },
      ctx
    );

    expect(ChatbotMovil.findByIdAndUpdate).toHaveBeenCalled();
    expect(result).toEqual(fakeUpdated);
  });

});
