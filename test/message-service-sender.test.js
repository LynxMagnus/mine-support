jest.mock('rhea-promise')
jest.mock('../app/config', () => ({
  claimQueueConfig: {
    claimQueue: 'claimQueue'
  }
}))
const mockSender = {
  close: () => {},
  send: jest.fn(async () => ({ settled: 'settled' }))
}
const mockConnection = {
  open: () => {},
  close: () => {},
  isOpen: () => true,
  createAwaitableSender: async () => mockSender
}

describe('Test message service', () => {
  let messageService
  let rheaPromiseMock

  beforeAll(async () => {
    rheaPromiseMock = require('rhea-promise')
    rheaPromiseMock.Container.mockImplementation(() => ({
      identifyYourself: 'abc',
      createConnection: () => mockConnection
    }))
    messageService = require('../app/services/message-service')
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('Message service sends the claim to the queue', async () => {
    const claimRecord = {
      claimId: 'MINE123',
      propertyType: 'business',
      accessible: false,
      dateOfSubsidence: new Date(),
      mineType: ['gold', 'iron']
    }
    const jsonData = JSON.stringify(claimRecord)

    await messageService.publishClaim(claimRecord)
    await expect(mockSender.send).toHaveBeenCalledTimes(1)
    await expect(mockSender.send).toHaveBeenCalledWith({ body: jsonData })
  })

  test('Message service acts correctly to an error while sending', async () => {
    const claimRecord = {
      claimId: 'MINE123',
      propertyType: 'business',
      accessible: false,
      dateOfSubsidence: new Date(),
      mineType: ['gold', 'iron']
    }
    mockSender.send.mockImplementation(() => { throw new Error() })
    return expect(messageService.publishClaim(claimRecord)).rejects.toThrow()
  })
})
