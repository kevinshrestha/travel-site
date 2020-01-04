const path = require('path')

const postCSSPlugins = [
  //imports in css files
  require('postcss-import'),
  //
  require('postcss-mixins'),
  //
  require('postcss-simple-vars'),
  //
  require('postcss-nested'),
  // Autoprefixer will use the data based on current browser 
  // popularity and property support to apply prefixes for you.
  require('autoprefixer')

]

module.exports = {
  entry: './app/assets/scripts/App.js',
  output: {
    filename: 'bundled.js',
    path: path.resolve(__dirname, 'app')
  },
  devServer: {
    before: function (app, server) {
      server._watch('./app/**/*.html')
    },
    contentBase: path.join(__dirname, 'app'),
    hot: true,
    port: 3000,
    host: '0.0.0.0',
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', { loader: 'postcss-loader', options: { plugins: postCSSPlugins } }]
      }
    ]
  }
}