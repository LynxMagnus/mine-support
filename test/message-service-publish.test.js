
describe('Test message service', () => {
  let messageService
  let MockMessageSender

  beforeAll(async () => {
    jest.mock('../app/services/messaging/message-sender')
  })

  beforeEach(async () => {
    jest.resetModules()
    messageService = require('../app/services/message-service')
    MockMessageSender = require('../app/services/messaging/message-sender')
  })

  afterEach(async () => {
    jest.clearAllMocks()
  })

  test('Publish claim sends message', async () => {
    await messageService.publishClaim({ dummy: 'data' })
    expect(MockMessageSender.mock.instances[0].sendMessage).toHaveBeenCalledTimes(1)
  })

  afterAll(async () => {
    jest.unmock('../app/services/message-service')
  })
})
