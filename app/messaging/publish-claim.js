const mqConfig = require('../config').claimQueueConfig
const { MessageSender } = require('ffc-messaging')
const createMessage = require('./create-message')
const sessionHandler = require('../services/session-handler')
let claimSender

async function stop () {
  await claimSender.closeConnections()
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
  claimSender = new MessageSender(mqConfig)
  await claimSender.connect()
  const claim = sessionHandler.get(request, 'claim')
  const message = createMessage(claim)
  await claimSender.sendMessage(message)
  await claimSender.closeConnection()
}

module.exports = publishClaim
