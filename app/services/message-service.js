const createQueue = require('./messaging/create-queue')
const MessageSender = require('./messaging/message-sender')
const config = require('../mq-config')

const claimSender = new MessageSender(config.claimQueueConfig, config.claimQueueConfig.queueUrl)

async function registerService () {
  if (config.claimQueueConfig.createQueue) {
    await createQueue(config.claimQueueConfig.name, config.claimQueueConfig)
  }
}

async function publishClaim (claim) {
  try {
    await Promise.all([
      claimSender.sendMessage(claim)
    ])
  } catch (err) {
    console.log(err)
    throw err
  }
}

module.exports = {
  registerService,
  publishClaim
}
