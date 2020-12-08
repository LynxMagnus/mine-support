const sessionHandler = require('../../services/session-handler')

function asArray (item) {
  return Array.isArray(item) ? item : [item]
}

const questionPageOptions = {
  ext: {
    onPostHandler: {
      method: async (request, h) => {
        if (request.app['hapi-govuk-question-page']) {
          const dataToSet = request.app['hapi-govuk-question-page'].data
          if (dataToSet.mineType !== undefined) {
            // ensure mineType is an array
            dataToSet.mineType = asArray(dataToSet.mineType)
          }
          sessionHandler.update(request, 'claim', dataToSet)
        }
        return h.continue
      }
    }
  }
}

module.exports = questionPageOptions
