const hapi = require('hapi')
const CatboxRedis = require('@hapi/catbox-redis')
const config = require('./config')

async function createServer () {
  // Create the hapi server
  const server = hapi.server({
    port: config.port,
    routes: {
      validate: {
        options: {
          abortEarly: false
        }
      }
    },
    cache: [{
      name: config.cacheName,
      provider: {
        constructor: CatboxRedis,
        options: {
          host: config.redisHost,
          port: config.redisPort,
          partition: 'mine-support'
        }
      }
    }]
  })

  // Register the plugins
  await server.register(require('inert'))
  await server.register(require('./plugins/views'))
  await server.register(require('./plugins/router'))
  await server.register(require('./plugins/error-pages'))
  await server.register(require('./plugins/session-cache'))

  if (config.isDev) {
    await server.register(require('blipp'))
    await server.register(require('./plugins/logging'))
  }

  return server
}

module.exports = createServer
