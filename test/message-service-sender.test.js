
describe('Test message sender', () => {
  let MessageSender
  let MockAWS
  const dummyObject = { dummy: 'data' }

  beforeAll(async () => {
    jest.mock('aws-sdk')
  })

  beforeEach(async () => {
    jest.resetModules()
    MessageSender = require('../app/services/messaging/message-sender')
  })

  afterEach(async () => {
    jest.clearAllMocks()
  })

  test('Decodes JSON message', async () => {
    const sender = new MessageSender(dummyObject, 'dummyName')
    const result = sender.decodeMessage(dummyObject)
    expect(typeof result).toBe('string')
  })

  test('Errors when trying to decode non JSON message', async () => {
    const sender = new MessageSender(dummyObject, 'dummyName')
    const bigInt = 1234567891234567n
    expect(() => { sender.decodeMessage(bigInt) }).toThrow()
  })

  test('Error caught from sendMessage error', async () => {
    jest.clearAllMocks()
    MockAWS = require('aws-sdk')
    MockAWS.SQS.mockImplementation(() => {
      return {
        sendMessage: () => {
          throw new Error('Test')
        }
      }
    })

    MessageSender = require('../app/services/messaging/message-sender')
    const sender = new MessageSender(dummyObject, 'dummyName')
    await expect(sender.sendMessage(dummyObject)).rejects.toThrow()
  })

  afterAll(async () => {
    jest.unmock('../app/services/message-service')
  })
})
