const ViewModel = require('../../app/models/name')

describe('name model', () => {
  test('Should include error if error', async () => {
    const model = new ViewModel('John', 'an error')
    expect(model.model.errorMessage.text).toBe('Please enter your name')
  })

  test('Should not include error if no error', async () => {
    const model = new ViewModel('John')
    expect(model.model.errorMessage).toBeUndefined()
  })

  test('Should include name if name supplied', async () => {
    const model = new ViewModel('John')
    expect(model.model.value).toBe('John')
  })
})
