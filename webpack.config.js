const path = require('path')

module.exports = {
  entry: './app/frontend/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'app/static/dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  }
}
