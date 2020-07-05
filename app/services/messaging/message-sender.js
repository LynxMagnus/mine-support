const appInsights = require('applicationinsights')
const { getSenderConfig } = require('./config-helper')
const MessageBase = require('./message-base')

class MessageSender extends MessageBase {
  constructor (name, config) {
    super(name, config)
    this.senderConfig = getSenderConfig(this.name, config)
  }

  async sendMessage (message) {
    const sender = this.sbClient.createSender(this.senderConfig.name)
    const data = JSON.stringify(message)
    // const sender = await this.connection.createAwaitableSender(this.senderConfig)
    let startTime
    let success = true
    let resultCode = 200
    try {
      console.log(`${this.name} sending message`, data)
      startTime = Date.now()
      // no need for delivery as sender.send returns Promise<void>
      const delivery = await sender.send({ body: data })
      console.log(`message sent ${this.name}`)
      return delivery
    } catch (error) {
      success = false
      resultCode = 500
      console.error('failed to send message', error)
      throw error
    } finally {
      console.log('trackDependency')
      const duration = Date.now() - startTime
      appInsights.defaultClient.trackDependency({ data, dependencyTypeName: 'AMQP', duration, name: 'claim message queue', resultCode, success, target: this.senderConfig.target.address })
      await sender.close()
    }
  }
}

module.exports = MessageSender
