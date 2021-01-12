const { MessageProviderPact } = require('@pact-foundation/pact')
const path = require('path')
const createMessage = require('../../app/messaging/create-message')

describe('Pact Verification', () => {
  test('validates the expectations of ffc-demo-claim-service', async () => {
    const claim = {
      claimId: 'MINE123',
      name: 'Joe Bloggs',
      propertyType: 'business',
      accessible: false,
      dateOfSubsidence: '2019-07-26T09:54:19.622Z',
      mineType: ['gold'],
      email: 'joe.bloggs@defra.gov.uk'
    }

    const provider = new MessageProviderPact({
      messageProviders: {
        'a request for new claim': () => createMessage(claim).body
      },
      provider: 'ffc-demo-web',
      pactUrls: [
        path.resolve(__dirname, './pacts/ffc-demo-claim-service-ffc-demo-web.json')
      ]
    })

    return provider.verify()
  })
})
