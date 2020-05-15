const joi = require('@hapi/joi')

const queueSchema = joi.object({
  name: joi.string().required(),
  endpoint: joi.string().required(),
  queueUrl: joi.string().required(),
  region: joi.string().default('eu-west-2'),
  accessKeyId: joi.string().optional(),
  secretAccessKey: joi.string().optional(),
  createQueue: joi.bool().default(true)
})

const mqSchema = joi.object({
  claimQueueConfig: queueSchema
})

const mqConfig = {
  claimQueueConfig: {
    name: process.env.CLAIM_QUEUE_NAME,
    endpoint: process.env.CLAIM_ENDPOINT,
    queueUrl: process.env.CLAIM_QUEUE_URL || `${process.env.CLAIM_ENDPOINT}/${process.env.CLAIM_QUEUE_NAME}`,
    region: process.env.CLAIM_QUEUE_REGION,
    accessKeyId: process.env.DEV_ACCESS_KEY_ID,
    secretAccessKey: process.env.DEV_ACCESS_KEY,
    createQueue: process.env.CREATE_CLAIM_QUEUE
  }
}

const mqResult = mqSchema.validate(mqConfig, {
  abortEarly: false
})

// Throw if config is invalid
if (mqResult.error) {
  throw new Error(`The message queue config is invalid. ${mqResult.error.message}`)
}

module.exports = mqResult.value
