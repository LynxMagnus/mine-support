const auth = require('@azure/ms-rest-nodeauth')
const MessageSender = require('./messaging/message-sender')
const config = require('../config')

process.on('SIGTERM', async () => {
  await messageService.closeConnections()
  process.exit(0)
})

process.on('SIGINT', async () => {
  await messageService.closeConnections()
  process.exit(0)
})

class MessageService {
  constructor (credentials) {
    this.publishClaim = this.publishClaim.bind(this)
    this.closeConnections = this.closeConnections.bind(this)
    this.claimSender = new MessageSender('claim-queue-sender', config.claimQueueConfig, credentials)
  }

  async closeConnections () {
    await this.claimSender.closeConnection()
  }

  async publishClaim (claim) {
    try {
      return await this.claimSender.sendMessage(claim)
    } catch (err) {
      console.log(err)
      throw err
    }
  }
}

let messageService

module.exports = (async function createConnections () {
  if (!messageService) {
    console.log('creating message service')
    const credentials = config.isProd ? await auth.loginWithVmMSI({ resource: 'https://servicebus.azure.net' }) : undefined
    console.log('message service credentials', credentials)
    messageService = new MessageService(credentials)
  }
  return messageService
}())
