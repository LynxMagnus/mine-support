const sessionHandler = require('./session-handler')
const messageService = require('./message-service')
const { getSessionId, logTraceMessage } = require('../util/app-insights-util')

module.exports = {
  submit: async (request) => {
    try {
      const claim = sessionHandler.get(request, 'claim')
      console.log('submitting claim')
      console.log(claim)

      logTraceMessage('Trace Sender - ffc-demo-web: demo-web-sender')

      await (await messageService).publishClaim(claim, getSessionId())
      return true
    } catch (err) {
      console.log(err)
      return false
    }
  }
}
