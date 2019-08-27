module.exports = {
  method: 'GET',
  path: '/liveness',
  options: {
    handler: (request, h) => {
      return h.response('ok').code(200)
    }
  }
}
