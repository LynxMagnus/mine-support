const config = require('../config')
const restClient = require('./rest-client')

module.exports = {
  submit: async (request) => {
    try {
      console.log('submitting claim')

      // Temporary workaround to provide valid claim to API gateway following removal of Redis
      const tempClaim = {
        'claimId': request.payload.claimId,
        'propertyType': 'business',
        'accessible': false,
        'dateOfSubsidence': '2019-07-26T09:54:19.622Z',
        'mineType': ['gold'],
        'email': request.payload.email
      }
      console.log(tempClaim)

      await restClient.postJson(`${config.apiGateway}/claim`, { payload: tempClaim })
      return true
    } catch (err) {
      console.log(err)
      return false
    }
  }
}
