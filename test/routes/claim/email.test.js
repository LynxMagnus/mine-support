describe('Email test', () => {
  let createServer
  let server
  let sendClaimMessage

  beforeAll(async () => {
    jest.mock('../../../app/services/message-service')
    jest.mock('../../../app/services/send-claim')
    createServer = require('../../../app/server')
  })

  beforeEach(async () => {
    server = await createServer()
    await server.initialize()
    sendClaimMessage = require('../../../app/services/send-claim')
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })

  test('GET /claim/email route returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/claim/email'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('POST /claim/email returns error message in body if no email provided', async () => {
    const postOptions = {
      method: 'POST',
      url: '/claim/email',
      payload: { email: 'dummy' }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Please enter valid email')
  })

  test('POST /claim/email sends claim message but fails if message doesn not send', async () => {
    const postOptions = {
      method: 'POST',
      url: '/claim/email',
      payload: { email: 'me@me.com' }
    }

    sendClaimMessage.submit.mockResolvedValue(false)

    const postResponse = await server.inject(postOptions)
    expect(sendClaimMessage.submit).toHaveBeenCalledTimes(1)
    expect(postResponse.payload).toContain('Sorry, the service is unavailable')
  })

  test('POST /claim/email sends claim message successfully and redirects to confirmation', async () => {
    const postOptions = {
      method: 'POST',
      url: '/claim/email',
      payload: { email: 'me@me.com' }
    }

    sendClaimMessage.submit.mockResolvedValue(true)

    const postResponse = await server.inject(postOptions)
    expect(sendClaimMessage.submit).toHaveBeenCalledTimes(1)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./confirmation')
  })
})
