const messageService = require('../../app/services/message-service')

describe('message service', () => {
  test('smoke test', async () => {
    await messageService.registerService()
  })
})
