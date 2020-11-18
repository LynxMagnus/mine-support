require('./services/app-insights').setup()
const createServer = require('./server')

createServer()
  .then(server => server.start())
  .catch(err => {
    console.error('App crashed test modification    ', err)
    process.exit(1)
  })
