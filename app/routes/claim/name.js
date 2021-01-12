const schema = require('../../schemas/name')
const sessionHandler = require('../../services/session-handler')
const ViewModel = require('../../models/name')

module.exports = [{
  method: 'GET',
  path: '/claim/name',
  options: {
    handler: (request, h) => {
      const claim = sessionHandler.get(request, 'name')
      return h.view('claim/name', new ViewModel(claim.accessible, null))
    }
  }
},
{
  method: 'POST',
  path: '/claim/name',
  options: {
    validate: {
      payload: schema,
      failAction: async (request, h, error) => {
        return h.view('claim/name', new ViewModel(request.payload.accessible, error)).takeover()
      }
    },
    handler: async (request, h) => {
      sessionHandler.update(request, 'name', request.payload)
      return h.redirect('./property-type')
    }
  }
}]
