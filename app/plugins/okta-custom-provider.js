// this is work done by Tim Costa (https://github.com/timcosta)
// in a PR for Bell https://github.com/hapijs/bell/pull/450 to support Okta custom authorisation servers
// this should be the default Okta provider in the next major release but has not been merged yet
// in the meantime manually add the provider

const Joi = require('@hapi/joi')

const internals = {
  schema: Joi.object({
    uri: Joi.string().uri().required(),
    authorizationServerId: Joi.string().alphanum()
  }).required()
}

function oktaCustomProvider (options) {
  const settings = Joi.attempt(options, internals.schema)

  const baseUri = settings.authorizationServerId
    ? `${settings.uri}/oauth2/${settings.authorizationServerId}`
    : `${settings.uri}/oauth2`

  return {
    protocol: 'oauth2',
    useParamsAuth: true,
    auth: `${baseUri}/v1/authorize`,
    token: `${baseUri}/v1/token`,
    scope: ['profile', 'openid', 'email', 'offline_access'],
    profile: async function (credentials, params, get) {
      const profile = await get(`${baseUri}/v1/userinfo`)

      credentials.profile = {
        id: profile.sub,
        username: profile.email,
        displayName: profile.nickname,
        firstName: profile.given_name,
        lastName: profile.family_name,
        email: profile.email,
        raw: profile
      }
    }
  }
}

module.exports = oktaCustomProvider
