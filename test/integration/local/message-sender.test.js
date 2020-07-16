const MessageSender = require('../../../app/services/messaging/message-sender')
const config = require('../../../app/config')

describe('message sender', () => {
  let messageSender

  beforeAll(async () => {
    messageSender = new MessageSender('test-sender', config.claimQueueConfig)
  })

  afterAll(async () => {
    await messageSender.closeConnection()
  })

  test('can send a message', async () => {
    const message = { greeting: 'test message' }

    await messageSender.sendMessage(message)
  })
})
