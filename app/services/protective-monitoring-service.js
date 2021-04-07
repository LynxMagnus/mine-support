const { PublishEvent } = require('ffc-protective-monitoring')

function sendEvent (request, claim, message) {
  const protectiveMonitoring = new PublishEvent(process.env.PROTECTIVE_MONITORING_URL)
  protectiveMonitoring.sendEvent({
    sessionid: claim.claimId,
    datetime: createEventDate(),
    version: '1.1',
    application: 'ffc-demo-web',
    component: 'ffc-demo-web',
    ip: getIpAddress(request),
    pmccode: '001',
    priority: '0',
    details: {
      message
    }
  })
  console.log(`Protective monitoring message sent: ${message}`)
}

function getIpAddress (request) {
  console.log('HEADERS', request.info)
  // Identifying the originating IP address of a client connecting to a web server through an HTTP proxy or a load balancer
  const xForwardedForHeader = request.headers['x-forwarded-for']
  return xForwardedForHeader ? xForwardedForHeader.split(',')[0] : request.info.remoteAddress
}

function createEventDate () {
  const eventDate = new Date()
  return eventDate.toISOString()
}

module.exports = sendEvent
