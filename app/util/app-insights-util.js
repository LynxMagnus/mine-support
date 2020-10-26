const appInsights = require('applicationinsights')

module.exports = {
  setOperationId: function (correlationId, message) {
    if (appInsights.defaultClient !== null && appInsights.defaultClient !== undefined) {
      const client = appInsights.defaultClient
      const operationIdTag = appInsights.defaultClient.context.keys.operationId
      client.context.tags[operationIdTag] = correlationId
    }
  },
  logTraceMessage: function (message) {
    if (appInsights.defaultClient !== null && appInsights.defaultClient !== undefined) {
      const client = appInsights.defaultClient

      client.trackTrace({ message: message })
    }
  }
}
