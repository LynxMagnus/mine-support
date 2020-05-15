
const bell = require('@hapi/bell')
const authCookie = require('@hapi/cookie')

const config = require('../config')
const isSecure = config.isProd
const redirectTo = config.oktaEnabled ? '/auth/okta' : '/auth/dev'

bell.providers['okta-custom'] = require('./okta-custom-provider')

function registerSessionAuth (server) {
  server.auth.strategy('session', 'cookie', {
    cookie: {
      name: 'ffc-demo-web',
      path: '/',
      password: config.cookiePassword,
      isSecure
    },
    redirectTo
  })
}

function registerOktaAuth (server) {
  // Declare an authentication strategy using the bell scheme
  // with the name of the provider, cookie encryption password,
  // and the OAuth client credentials.
  server.auth.strategy('okta', 'bell', {
    provider: 'okta-custom',
    config: {
      uri: `https://${config.okta.domain}`,
      authorizationServerId: config.okta.authorizationServerId
    },
    password: config.cookiePassword,
    scope: ['email', 'profile', 'openid', ...config.okta.scopes],
    isSecure,
    location: config.okta.url,
    clientId: config.okta.clientId,
    clientSecret: config.okta.clientSecret
  })
}

module.exports = {
  plugin: {
    name: 'auth',
    register: async (server) => {
      await server.register([authCookie, bell])
      registerSessionAuth(server)
      if (config.oktaEnabled) {
        registerOktaAuth(server)
      }
    }
  }
}
