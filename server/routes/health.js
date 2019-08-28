module.exports = {
  method: 'GET',
  path: '/health',
  options: {
    handler: (request, h) => {
      return h.response('ok').code(200)
    }
  }
}
