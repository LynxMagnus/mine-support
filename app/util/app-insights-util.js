const appInsights = require('applicationinsights')

module.exports = {
  setOperationId: (correlationId) => {
    const operationIdTag = appInsights.defaultClient.context.keys.operationId
    appInsights.defaultClient.context.tags[operationIdTag] = correlationId
  },
  logTraceMessage: (message) => {
    appInsights.defaultClient.trackTrace({ message })
  }
}
