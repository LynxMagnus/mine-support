const schema = require('../../app/schemas/name')

describe('name schema', () => {
  test('Should pass validation for valid string', async () => {
    const result = schema.validate({ name: 'John' })

    if (result.error) {
      throw new Error(`The server config is invalid. ${result.error.message}`)
    }
  })

  test('Should fail validation for empty string', async () => {
    const result = schema.validate({ name: '' })
    expect(result.error).toBeDefined()
  })

  test('Should fail validation for invalid property', async () => {
    const result = schema.validate({ fullName: 'John' })
    expect(result.error).toBeDefined()
  })
})
