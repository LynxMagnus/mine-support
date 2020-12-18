const sessionHandler = require('../../services/session-handler')

module.exports = [
  {
    method: ['GET', 'POST'],
    path: '/claim/date-of-subsidence',
    handler: {
      'hapi-govuk-question-page': {
        getConfig: async () => {
          return {
            $VIEW$: { serviceName: 'FFC Demo Service' }
          }
        },
        getData: (request) => {
          const { dateOfSubsidence } = sessionHandler.get(request, 'claim')
          const date = dateOfSubsidence ? new Date(dateOfSubsidence) : undefined
          return { dateOfSubsidence: date }
        },
        getNextPath: () => './mine-type',
        pageDefinition: require('./page-definitions/date-of-subsidence')
      }
    },
    options: require('./question-page-options')
  }
]
