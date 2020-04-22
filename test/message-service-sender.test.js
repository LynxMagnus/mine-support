
describe('Test message sender', () => {
  let MessageSender
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
    const bigInt = 9007199254740991n
    expect(() => { sender.decodeMessage(bigInt) }).toThrow()
  })

  afterAll(async () => {
    jest.unmock('../app/services/message-service')
  })
})
