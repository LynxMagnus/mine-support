describe('auth/dev test', () => {
  let createServer
  let server

  beforeAll(async () => {
    createServer = require('../../../../app/server')
  })

  beforeEach(async () => {
    server = await createServer()
    await server.initialize()
  })

  test('GET /auth/dev sets auth cookie and redirects', async () => {
    const authUrlOptions = {
      method: 'GET',
      url: '/auth/dev'
    }

    const authResponse = await server.inject(authUrlOptions)
    expect(authResponse.statusCode).toBe(302)
    expect(authResponse.headers['set-cookie'][0]).toContain('ffc-demo-web=')
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
