const hoek = require('@hapi/hoek')

module.exports = {
  get: function (request, key) {
    console.log(`no cached value for ${key}`)
    return {}
  },
  set: function (request, key, value) {
    console.log(`setting cached value for ${key}`)
  },
  update: function (request, key, object) {
    const existing = {}
    hoek.merge(existing, object, true, false)
  },
  clear: function (request, key) {
    console.log(`clearing cached value for ${key}`)
  }
}
