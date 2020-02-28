describe('Accessible test', () => {
  let createServer
  let server

  beforeAll(async () => {
    createServer = require('../../../app/server')
    server = await createServer()
    await server.initialize()
  })

  test('GET /claim/accessible route returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/claim/accessible'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  afterAll(async () => {
    await server.stop()
  })
})
