// const rheaPromise = require('rhea-promise')
const { ServiceBusClient } = require('@azure/service-bus')

class MessageBase {
  constructor (name, config) {
    this.name = name
    // const container = new rheaPromise.Container()
    // this.connection = container.createConnection(config)
    const connectionString = `Endpoint=sb://${config.host}/;SharedAccessKeyName=${config.username};SharedAccessKey=${config.password}`
    this.sbClient = new ServiceBusClient(connectionString)
  }

  async openConnection () {
    // try {
    //   await this.connection.open()
    console.log(`${this.name} connection opened`)
    // } catch (error) {
    //   console.error(`error opening ${this.name} connection`, error)
    //   throw error
    // }
  }

  async closeConnection () {
    // await this.connection.close()
    await this.sbClient.close()
    console.log(`${this.name} connection closed`)
  }
}

module.exports = MessageBase
