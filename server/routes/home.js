module.exports = {
  method: 'GET',
  path: '/',
  options: {
    handler: (request, h) => {
      return h.view('home', { message: `hello ${process.env.MINE_SUPPORT_MESSAGE}` })
    }
  }
}
