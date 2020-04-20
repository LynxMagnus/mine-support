module.exports = {
  method: 'GET',
  path: '/account',
  options: {
    auth: {
      mode: 'required',
      strategy: 'session'
    },
    handler: (request, h) => {
      const { firstName, lastName, username } = request.auth.credentials.profile
      return h.view('account', { firstName, lastName, username })
    }
  }
}
