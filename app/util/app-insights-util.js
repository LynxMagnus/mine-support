const appInsightsService = (appInsightClient) => {
  const setOperationId = (correlationId) => {
    if (appInsightClient !== null && appInsightClient !== undefined) {
      const operationIdTag = appInsightClient.context.keys.operationId
      appInsightClient.context.tags[operationIdTag] = correlationId
    }
  }
  const logTraceMessage = (message) => {
    if (appInsightClient !== null && appInsightClient !== undefined) {
      appInsightClient.trackTrace({ message: message })
    }
  }

  return {
    setOperationId,
    logTraceMessage
  }
}

module.exports = appInsightsService
