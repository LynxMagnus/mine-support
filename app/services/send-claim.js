const sessionHandler = require('./session-handler')
const messageService = require('./message-service')

module.exports = {
  submit: async (request) => {
    try {
      const claim = sessionHandler.get(request, 'claim')
      console.log('submitting claim')
      console.log(claim)
      await (await messageService).publishClaim(claim)
      return true
    } catch (err) {
      console.log(err)
      return false
    }
  }
}
