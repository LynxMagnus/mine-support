
describe('Test message service', () => {
  let messageService
  let MockMessageSender

  beforeAll(async () => {
    jest.mock('../../app/services/messaging/message-sender')
  })

  beforeEach(async () => {
    jest.resetModules()
    messageService = require('../../app/services/message-service')
    MockMessageSender = require('../../app/services/messaging/message-sender')
  })

  afterEach(async () => {
    jest.clearAllMocks()
  })

  test('Publish claim sends message', async () => {
    const message = { dummy: 'data' }
    await messageService.publishClaim(message)
    expect(MockMessageSender.mock.instances[0].sendMessage).toHaveBeenCalledTimes(1)
    expect(MockMessageSender.mock.instances[0].sendMessage).toHaveBeenCalledWith(message)
  })

  afterAll(async () => {
    jest.unmock('../../app/services/message-service')
  })
})
