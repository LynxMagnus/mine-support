const pa11y = require('pa11y')

const routes = [
  '/',
  '/claim/property',
  '/claim/accessible',
  '/claim/mine-type',
  '/claim/date-of-subsidence',
  '/claim/email',
  '/claim/confirmation'
]

const config = {
  chromeLaunchConfig: {
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage'
    ]
  },
  ignore: [
    'WCAG2AA.Principle1.Guideline1_3.1_3_1.F92,ARIA4'
  ]
}

describe('accessibility tests', () => {
  test('pass for all routes', async () => {
    const results = await Promise.all(routes.map(runAccessibilityTest))
    console.log(results)
  })
})

async function runAccessibilityTest (path) {
  return await pa11y(`http://localhost${path}`, config)
}
