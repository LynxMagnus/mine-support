const appInsights = require('applicationinsights')

function setup () {
  if (process.env.APPINSIGHTS_INSTRUMENTATIONKEY) {
    console.log('APPINSIGHTS_INSTRUMENTATIONKEY successfully retrieved!')
    appInsights.setup().start()
    const cloudRoleTag = appInsights.defaultClient.context.keys.cloudRole
    const appName = process.env.APPINSIGHTS_CLOUDROLE
    appInsights.defaultClient.context.tags[cloudRoleTag] = appName
  } else {
    console.log('APPINSIGHTS_INSTRUMENTATIONKEY not found!')
  }
}

module.exports = { setup }
