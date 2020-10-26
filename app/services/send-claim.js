const sessionHandler = require('./session-handler')
const messageService = require('./message-service')
const AppInsightsUtil = require('../util/app-insights-util')
const { v4: uuidv4 } = require('uuid')
const appInsights = require('applicationinsights')

module.exports = {
  submit: async (request) => {
    try {
      const claim = sessionHandler.get(request, 'claim')
      console.log('submitting claim')
      console.log(claim)

      const appInsightService = AppInsightsUtil(appInsights.defaultClient)
      const correlationId = uuidv4()
      appInsightService.setOperationId(correlationId)
      appInsightService.logTraceMessage('Trace Sender - ffc-demo-web: demo-web-sender')

      await (await messageService).publishClaim(claim, correlationId)
      return true
    } catch (err) {
      console.log(err)
      return false
    }
  }
}
