describe('Test message service', () => {
  let messageService
  let MockMessageSender

  beforeAll(async () => {
    jest.mock('../../app/services/messaging/message-sender')
  })

  beforeEach(async () => {
    jest.resetModules()
    messageService = await require('../../app/services/message-service')
    MockMessageSender = require('../../app/services/messaging/message-sender')
  })

  afterEach(async () => {
    jest.clearAllMocks()
  })

  test('Publish claim sends message', async () => {
    const correlationId = '4026dd58-5e85-4538-9c1b-7b66bdb916c6'
    const message = { dummy: 'data' }
    await messageService.publishClaim(message, correlationId)
    expect(MockMessageSender.mock.instances[0].sendMessage).toHaveBeenCalledTimes(1)
    expect(MockMessageSender.mock.instances[0].sendMessage).toHaveBeenCalledWith(message, correlationId)
  })

  afterAll(async () => {
    jest.unmock('../../app/services/message-service')
  })
})
