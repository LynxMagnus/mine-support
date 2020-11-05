const getOktaConfig = require('../../app/config/get-okta-config')
const origclientId = process.env.OKTA_CLIENT_ID
describe('get okta config', () => {
  afterAll(async () => {
    process.env.OKTA_CLIENT_ID = origclientId
  })

  test('Should pass validation for all fields populated', async () => {
    const oktaConfig = getOktaConfig()
    expect(oktaConfig).toBeDefined()
  })
  test('Should fail validation if all fields not populated', async () => {
    process.env.OKTA_CLIENT_ID = ''
    expect(() => getOktaConfig()).toThrow(new Error('The okta config is invalid. "clientId" is not allowed to be empty'))
  })
})
