describe('account page', () => {
  let createServer
  let server
  beforeAll(async () => {
    createServer = require('../../app/server')
  })
  beforeEach(async () => {
    server = await createServer()
    await server.initialize()
  })
  test('GET /account redirects when unauthorised', async () => {
    const options = {
      method: 'GET',
      url: '/account'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('/auth/dev')
  })

  test('GET / route displays payments authenticated user', async () => {
    const testUserProfile = {
      username: 'testuser',
      firstName: 'Testuser',
      lastName: 'Usertest'
    }

    const homeOptions = {
      method: 'GET',
      url: '/account',
      auth: { strategy: 'session', credentials: { profile: testUserProfile } }
    }

    const homeResponse = await server.inject(homeOptions)
    expect(homeResponse.statusCode).toBe(200)
    expect(homeResponse.payload).toContain('testuser')
    expect(homeResponse.payload).toContain('Testuser')
    expect(homeResponse.payload).toContain('Usertest')
  })

  afterEach(async () => {
    await server.stop()
    jest.clearAllMocks()
  })
  afterAll(async () => {
    jest.clearAllMocks()
  })
})
