describe('Liveness test', () => {
  let createServer
  let server

  beforeAll(async () => {
    createServer = require('../../server')
  })

  beforeEach(async () => {
    server = await createServer()
    await server.initialize()
  })

  test('GET /liveness route returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/liveness'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  afterEach(async () => {
    await server.stop()
  })
})
