const schema = require('../../schemas/name')
const sessionHandler = require('../../services/session-handler')
const ViewModel = require('../../models/name')

module.exports = [{
  method: 'GET',
  path: '/claim/name',
  options: {
    handler: (request, h) => {
      const claim = sessionHandler.get(request, 'claim')
      return h.view('claim/name', new ViewModel(claim.name, null))
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
        return h.view('claim/name', new ViewModel(request.payload.name, error)).takeover()
      }
    },
    handler: async (request, h) => {
      sessionHandler.update(request, 'claim', request.payload)
      return h.redirect('./property-type')
    }
  }
}]
