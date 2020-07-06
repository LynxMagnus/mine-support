const appInsights = require('applicationinsights')

function setup () {
  if (process.env.APPINSIGHTS_INSTRUMENTATIONKEY) {
    appInsights
      .setup()
      // 'developer' mode
      .setInternalLogging(true, true)
      .start()
    // send events more often
    appInsights.defaultClient.config.maxBatchSize = 1
    const cloudRoleTag = appInsights.defaultClient.context.keys.cloudRole
    const appName = process.env.APPINSIGHTS_CLOUDROLE
    appInsights.defaultClient.context.tags[cloudRoleTag] = appName
    console.log('APPINSIGHTS_INSTRUMENTATIONKEY found. Application Insights has been turned on.')
  } else {
    console.log('No APPINSIGHTS_INSTRUMENTATIONKEY found. Application Insights is not active.')
  }
}

module.exports = { setup }
