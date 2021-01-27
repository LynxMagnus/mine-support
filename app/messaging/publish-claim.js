const mqConfig = require('../config').claimQueueConfig
const { MessageSender } = require('ffc-messaging')
const createMessage = require('./create-message')
const sessionHandler = require('../services/session-handler')
let claimSender

async function stop () {
  await claimSender.closeConnection()
}

process.on('SIGTERM', async () => {
  await stop()
  process.exit(0)
})

process.on('SIGINT', async () => {
  await stop()
  process.exit(0)
})

async function publishClaim (request) {
  console.log(request)
  console.log('getting session')
  const claim = sessionHandler.get(request, 'claim')
  console.log(`creating message for claim: ${claim}`)
  const message = createMessage(claim)
  console.log('creating sender with config')
  console.log(mqConfig)
  claimSender = new MessageSender(mqConfig)
  console.log(`sending message: ${message}`)
  await claimSender.sendMessage(message)
  console.log('closing connection')
  await claimSender.closeConnection()
}

module.exports = publishClaim
