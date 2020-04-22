
describe('Test send claim', () => {
  let sendClaimMessage
  let mockMessageService
  let sessionHandler

  beforeAll(async () => {
    jest.mock('../app/services/message-service')
    jest.mock('../app/services/session-handler')
  })

  beforeEach(async () => {
    jest.resetModules()
    mockMessageService = require('../app/services/message-service')
    sendClaimMessage = require('../app/services/send-claim')
    sessionHandler = require('../app/services/session-handler')

    sessionHandler.get.mockResolvedValue({
      claimId: 'MINE123',
      propertyType: 'business',
      accessible: false,
      dateOfSubsidence: new Date(),
      mineType: ['gold', 'iron'],
      email: 'joe.bloggs@defra.gov.uk'
    })
  })

  afterEach(async () => {
    jest.clearAllMocks()
  })

  test('Claim service publishes the claim to the message broker', async () => {
    const result = await sendClaimMessage.submit('dummy')
    expect(mockMessageService.publishClaim).toHaveBeenCalledTimes(1)
    expect(result).toBe(true)
  })

  test('Catch error thrown by publish message', async () => {
    mockMessageService.publishClaim.mockImplementation(() => {
      throw new Error()
    })

    const result = await sendClaimMessage.submit('dummy')
    expect(mockMessageService.publishClaim).toThrow(Error)
    expect(result).toBe(false)
  })

  afterAll(async () => {
    jest.unmock('../app/services/message-service')
    jest.unmock('../app/services/session-handler')
  })
})
