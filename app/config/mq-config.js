const joi = require('@hapi/joi')

const mqSchema = joi.object({
  messageQueue: {
    host: joi.string().default('localhost'),
    usePodIdentity: joi.bool().default(false),
    type: joi.string(),
    appInsights: joi.object()
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
    usePodIdentity: process.env.NODE_ENV === 'production',
    type: 'queue',
    appInsights: process.env.NODE_ENV === 'production' ? require('applicationinsights') : undefined
  },
  claimQueue: {
    address: process.env.CLAIM_QUEUE_ADDRESS,
    username: process.env.MESSAGE_QUEUE_USER,
    password: process.env.MESSAGE_QUEUE_PASSWORD
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
