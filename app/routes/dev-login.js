const devProfile = {
  username: 'devuser',
  firstName: 'Dev',
  lastName: 'Patel'
}

module.exports = {
  method: 'GET',
  path: '/auth/dev',
  options: {
    auth: {
      strategy: 'session',
      mode: 'try'
    },
    handler: function (request, h) {
      request.cookieAuth.set({ profile: devProfile })
      console.info('Authenticated as', devProfile.username)
      return h.redirect('/account')
    }
  }
}
