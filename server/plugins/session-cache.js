const config = require('../config')
module.exports = {
  plugin: require('@hapi/yar'),
  options: {
    storeBlank: true,
    maxCookieSize: 1,
    cache: {
      cache: config.cacheName || 'session-cache',
      expiresIn: config.sessionTimeoutMinutes * 60 * 1000
    },
    cookieOptions: {
      password: config.cookiePassword,
      isSecure: config.env !== 'development'
    }
  }
}
