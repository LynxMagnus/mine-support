const MessageSender = require('./messaging/message-sender')
const config = require('../config')

const messageSender = new MessageSender('claim-queue-sender', config.claimQueueConfig)

async function registerQueues () {
  await openConnections()
}

process.on('SIGTERM', async function () {
  await closeConnections()
  process.exit(0)
})

process.on('SIGINT', async function () {
  await closeConnections()
  process.exit(0)
})

async function closeConnections () {
  await messageSender.closeConnection()
}

async function openConnections () {
  await messageSender.openConnection()
}

async function publishClaim (claim) {
  await messageSender.sendMessage(claim)
}

module.exports = {
  registerQueues,
  publishClaim,
  closeConnections
}
