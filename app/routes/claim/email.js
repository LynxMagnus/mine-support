const publishClaim = require('../../messaging/publish-claim')
const idService = require('../../services/id-service')
const schema = require('../../schemas/email')
const sessionHandler = require('../../services/session-handler')
const ViewModel = require('../../models/email')

module.exports = [{
  method: 'GET',
  path: '/claim/email',
  options: {
    handler: (request, h) => {
      const claim = sessionHandler.get(request, 'claim')
      return h.view('claim/email', new ViewModel(claim.email, null))
    }
  }
},
{
  method: 'POST',
  path: '/claim/email',
  options: {
    validate: {
      payload: schema,
      failAction: async (request, h, error) => {
        return h.view('claim/email', new ViewModel(request.payload.email, error)).takeover()
      }
    },
    handler: async (request, h) => {
      const claim = sessionHandler.get(request, 'claim')

      if (!claim.submitted) {
        try {
          request.payload.claimId = idService.generateId()
          sessionHandler.update(request, 'claim', request.payload)
          await publishClaim(request.payload)
          console.error(`Submitted claim ${request.payload.claimId}`)
          request.payload.submitted = true
          sessionHandler.update(request, 'claim', request.payload)
        } catch (err) {
          console.error('Failed to submit claim', err)
          return h.view('service-unavailable')
        }
      }
      return h.redirect('./confirmation')
    }
  }
}]
