let mockAppInsights
let appInsightUtil

describe('App Insights Util', () => {
  beforeEach(() => {
    jest.mock('applicationinsights', () => ({
      defaultClient: {
        trackTrace: jest.fn(),
        context: {
          keys: {
            operationId: '1234'
          },
          tags: {}
        }
      }
    }))
    mockAppInsights = require('applicationinsights')
    appInsightUtil = require('../../app/util/app-insights-util')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('setOperationId updates operation Id to match correlation Id', async () => {
    const testCorrelationId = 'd79dd6fe-72fc-43a8-b4c4-ec9c6bc7db9d'
    appInsightUtil.setOperationId(testCorrelationId)
    expect(mockAppInsights.defaultClient.context.tags['1234']).toBe(testCorrelationId)
  })

  test('logTraceMessage calls trace function', async () => {
    appInsightUtil.logTraceMessage('Trace Sender - ffc-demo-web: demo-web-sender')
    expect(mockAppInsights.defaultClient.trackTrace).toHaveBeenCalledTimes(1)
  })
})
