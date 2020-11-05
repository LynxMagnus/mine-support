const mqConfig = require('../config').claimQueueConfig
const { MessageSender } = require('ffc-messaging')
const createMessage = require('./create-message')
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

async function publishClaim (claim) {
  claimSender = new MessageSender(mqConfig)
  await claimSender.connect()
  const message = createMessage(claim)
  await claimSender.sendMessage(message)
  await claimSender.closeConnection()
}

module.exports = publishClaim
