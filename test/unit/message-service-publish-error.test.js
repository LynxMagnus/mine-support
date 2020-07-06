
describe('Test message service', () => {
  let messageService
  let MockMessageSender

  beforeAll(async () => {
    jest.mock('../../app/services/messaging/message-sender')
  })

  beforeEach(async () => {
    jest.resetModules()
    MockMessageSender = require('../../app/services/messaging/message-sender')
    MockMessageSender.mockImplementation(() => {
      return {
        sendMessage: () => {
          throw new Error('Test')
        }
      }
    })

    messageService = require('../../app/services/message-service')
  })

  afterEach(async () => {
    jest.clearAllMocks()
  })

  test('Check error thrown if message can send error', async () => {
    await expect(messageService.publishClaim({ dummy: 'data' })).rejects.toThrow()
  })

  afterAll(async () => {
    jest.unmock('../../app/services/message-service')
  })
})
