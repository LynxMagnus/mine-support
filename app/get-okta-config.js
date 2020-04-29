const Joi = require('@hapi/joi')

function getOktaConfig () {
// Define config schema
  const schema = Joi.object({
    domain: Joi.string().required(),
    clientId: Joi.string().required(),
    clientSecret: Joi.string().required(),
    authorizationServerId: Joi.string().required(),
    url: Joi.string().required(),
    scopes: Joi.array().items(Joi.string()).required()
  })

  // Build config
  const oktaConfig = {
    domain: process.env.OKTA_DOMAIN,
    clientId: process.env.OKTA_CLIENT_ID,
    clientSecret: process.env.OKTA_CLIENT_SECRET,
    authorizationServerId: process.env.OKTA_AUTH_SERVER_ID,
    url: process.env.SITE_URL,
    scopes: ['ffc-demo.accounts.read.self']
  }
  // Validate config
  const result = schema.validate(oktaConfig, {
    abortEarly: false
  })

  // Throw if config is invalid
  if (result.error) {
    throw new Error(`The okta config is invalid. ${result.error.message}`)
  }
  return result.value
}

module.exports = getOktaConfig
