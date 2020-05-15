const Boom = require('@hapi/boom')

module.exports = {
  method: 'GET',
  path: '/auth/okta',
  options: {
    auth: {
      strategy: 'okta',
      mode: 'try'
    },
    handler: function (request, h) {
      console.log('/auth/okta')
      if (!request.auth.isAuthenticated) {
        throw Boom.unauthorized('Authentication failed: ' + request.auth.error.message)
      }
      console.log('authenticated', request.auth.credentials.profile.username)
      request.cookieAuth.set(request.auth.credentials)
      return h.redirect('/account')
    }
  }
}
