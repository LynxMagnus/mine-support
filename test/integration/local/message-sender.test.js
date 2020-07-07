const MessageSender = require('../../../app/services/messaging/message-sender')

const config = require('../../../app/config')

let messageSender
const address = 'test-send'
const message = { greeting: 'test message' }

describe('message sender', () => {
  afterEach(async () => {
    await messageSender.closeConnection()
  })
  test('can send a message', async () => {
    const testConfig = { ...config.claimQueueConfig, address }
    messageSender = new MessageSender('test-sender', testConfig)
    await messageSender.openConnection()
    const delivery = await messageSender.sendMessage(message)
    expect(delivery.settled).toBeTruthy()
  })
})
