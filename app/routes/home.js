const { setSessionId } = require('../util/app-insights-util')
const { v4: uuidv4 } = require('uuid')

module.exports = {
  method: 'GET',
  path: '/',
  options: {
    handler: (request, h) => {
      const correlationId = uuidv4()
      setSessionId(correlationId)
      return h.view('home')
    }
  }
}
