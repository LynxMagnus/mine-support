const MessageSender = require('../../app/services/messaging/message-sender')
const createQueue = require('../../app/services/messaging/create-queue')
const purgeQueue = require('../../app/services/messaging/purge-queue')

const config = require('../../app/mq-config')
const queueName = 'testq1'
const queueUrl = `${config.claimQueueConfig.endpoint}/queue/${queueName}`

beforeAll(async () => {
  await createQueue(queueName, config.claimQueueConfig)
})

afterAll(async () => {
  await purgeQueue(queueUrl, config.claimQueueConfig)
})

describe('send message', () => {
  test('sends a json message', async () => {
    jest.setTimeout(30000)
    const sender = new MessageSender(config.claimQueueConfig, queueUrl)
    const result = await sender.sendMessage({ greeting: 'test message' })
    console.log(result)
    expect(result).toBeDefined()
  })
})
