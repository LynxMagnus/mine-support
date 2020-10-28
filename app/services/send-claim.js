const sessionHandler = require('./session-handler')
const messageService = require('./message-service')
const { setOperationId, logTraceMessage } = require('../util/app-insights-util')
const { v4: uuidv4 } = require('uuid')

module.exports = {
  submit: async (request) => {
    try {
      const claim = sessionHandler.get(request, 'claim')
      console.log('submitting claim')
      console.log(claim)

      const correlationId = uuidv4()
      setOperationId(correlationId)
      logTraceMessage('Trace Sender - ffc-demo-web: demo-web-sender')

      await (await messageService).publishClaim(claim, correlationId)
      return true
    } catch (err) {
      console.log(err)
      return false
    }
  }
}
