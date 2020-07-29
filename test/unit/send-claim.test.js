describe('Test send claim', () => {
  let sendClaimMessage
  let messageService
  let sessionHandler

  beforeAll(async () => {
    jest.mock('../../app/services/session-handler')
  })

  beforeEach(async () => {
    sendClaimMessage = require('../../app/services/send-claim')
    sessionHandler = require('../../app/services/session-handler')
    messageService = await require('../../app/services/message-service')
    messageService.publishClaim = jest.fn()

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
    expect(messageService.publishClaim).toHaveBeenCalledTimes(1)
    expect(result).toBe(true)
  })

  test('Catch error thrown by publish message', async () => {
    messageService.publishClaim.mockImplementation(() => {
      throw new Error()
    })

    const result = await sendClaimMessage.submit('dummy')
    expect(messageService.publishClaim).toThrow(Error)
    expect(result).toBe(false)
  })

  afterAll(async () => {
    jest.unmock('../../app/services/session-handler')
  })
})
