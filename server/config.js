const joi = require('@hapi/joi')

// Define config schema
const schema = {
  port: joi.number().default(3000),
  env: joi.string().valid('development', 'test', 'production').default('development'),
  cacheName: joi.string().default('redisCache'),
  redisHost: joi.string().default('localhost'),
  redisPort: joi.number().default(6379),
  cookiePassword: joi.string().required(),
  sessionTimeoutMinutes: joi.number().default(30),
  apiGateway: joi.string().uri().default('http://localhost:3001'),
  restClientTimeoutMillis: joi.number().default(5000)
}

// Build config
const config = {
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  cacheName: process.env.MINE_SUPPORT_CACHE_NAME,
  redisHost: process.env.REDIS_HOSTNAME,
  redisPort: process.env.REDIS_PORT,
  cookiePassword: process.env.COOKIE_PASSWORD,
  sessionTimeoutMinutes: process.env.MINE_SUPPORT_SESSION_TIMEOUT_IN_MINUTES,
  apiGateway: process.env.MINE_SUPPORT_API_GATEWAY,
  restClientTimeoutMillis: process.env.MINE_SUPPORT_REST_CLIENT_TIMEOUT_IN_MILLIS
}

// Validate config
const result = joi.validate(config, schema, {
  abortEarly: false
})

// Throw if config is invalid
if (result.error) {
  throw new Error(`The server config is invalid. ${result.error.message}`)
}

// Use the joi validated value
const value = result.value

// Add some helper props
value.isDev = (value.env === 'development' || value.env === 'test')
value.isTest = value.env === 'test'
value.isProd = value.env === 'production'
module.exports = value
