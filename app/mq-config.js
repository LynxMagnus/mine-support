const joi = require('@hapi/joi')

const mqSchema = joi.object({
  messageQueue: {
    host: joi.string().default('localhost'),
    hostname: joi.string().default('localhost'),
    port: joi.number().default(5672),
    reconnect_Limit: joi.number().default(10),
    transport: joi.string().default('tcp')
  },
  claimQueue: {
    address: joi.string().default('claim'),
    username: joi.string(),
    password: joi.string()
  }
})

const mqConfig = {
  messageQueue: {
    host: process.env.MESSAGE_QUEUE_HOST,
    hostname: process.env.MESSAGE_QUEUE_HOST,
    port: process.env.MESSAGE_QUEUE_PORT,
    reconnect_Limit: process.env.MESSAGE_QUEUE_RECONNECT_LIMIT,
    transport: process.env.MESSAGE_QUEUE_TRANSPORT
  },
  claimQueue: {
    address: process.env.CLAIM_QUEUE_ADDRESS,
    username: process.env.CLAIM_QUEUE_USER,
    password: process.env.CLAIM_QUEUE_PASSWORD
  }
}

const mqResult = mqSchema.validate(mqConfig, {
  abortEarly: false
})

// Throw if config is invalid
if (mqResult.error) {
  throw new Error(`The message queue config is invalid. ${mqResult.error.message}`)
}

const claimQueueConfig = { ...mqResult.value.messageQueue, ...mqResult.value.claimQueue }

module.exports = {
  claimQueueConfig
}
