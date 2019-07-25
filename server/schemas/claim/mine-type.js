const Joi = require('@hapi/joi')

module.exports = Joi.array().items(Joi.any().valid('gold', 'coal', 'iron', 'other')).single()
