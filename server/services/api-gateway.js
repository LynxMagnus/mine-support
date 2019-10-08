const config = require('../config')
const restClient = require('./rest-client')
const sessionHandler = require('./session-handler')

module.exports = {
  submit: async (request) => {
    try {
      const claim = sessionHandler.get(request, 'claim')
      console.log('submitting claim')

      // Temporary workaround to provide valid claim to API gateway following removal of Redis
      const tempClaim = {
        'claimId': 'MINE123',
        'propertyType': 'business',
        'accessible': false,
        'dateOfSubsidence': '2019-07-26T09:54:19.622Z',
        'mineType': ['gold'],
        'email': claim.email
      }

      await restClient.postJson(`${config.apiGateway}/claim`, { payload: tempClaim })
      return true
    } catch (err) {
      console.log(err)
      return false
    }
  }
}
