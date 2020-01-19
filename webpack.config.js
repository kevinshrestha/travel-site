const currentTask = process.env.npm_lifecycle_event
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const fse = require('fs-extra')

const postCSSPlugins = [
  //imports in css files
  require('postcss-import'),
  //
  require('postcss-mixins'),
  //
  require('postcss-simple-vars'),
  //
  require('postcss-nested'),
  //converts hex colors to rgba
  require('postcss-hexrgba'),
  // Autoprefixer will use the data based on current browser 
  // popularity and property support to apply prefixes for you.
  require('autoprefixer')
]

// when running build, the images will be copied over to the dist folder
class RunAfterCompile {
  apply(compiler) {
    compiler.hooks.done.tap('Copy images', function() {
      fse.copySync('./app/assets/images', './docs/assets/images')
    })
  }
}

let cssConfig = {
  test: /\.css$/i,
  use: ['css-loader?url=false', {loader: 'postcss-loader', options: {plugins: postCSSPlugins}}]
}

//fse is fs-extra
let pages = fse.readdirSync('./app').filter(function(file) {
  return file.endsWith('.html')
//map will generate a new array based on this array
}).map(function (page) {
  return new HtmlWebpackPlugin({
    filename: page,
    template: `./app/${page}`
  })
})

//shared between dev and build
let config = {
  entry: './app/assets/scripts/App.js',
  plugins: pages,
  module: {
    rules: [
      cssConfig
    ]
  }
}

//dev config files
if (currentTask == 'dev') {
  //unshift adds an item at the beginning of the array
  cssConfig.use.unshift('style-loader')
  config.output = {
    filename: 'bundled.js',
    path: path.resolve(__dirname, 'app')
  }
  config.devServer = {
    before: function (app, server) {
      server._watch('./app/**/*.html')
    },
    contentBase: path.join(__dirname, 'app'),
    hot: true,
    port: 3000,
    host: '0.0.0.0',
  }
  config.mode = 'development'
}

//build config files
if (currentTask == 'build') {
  //this rule only applies to javascript files
  config.module.rules.push({
    test: /\.js$/,
    //we ignore the node modules files the we don't want to worry about converting or transpiling
    exclude: /(node_modules)/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env']
      }
    }
  })

  cssConfig.use.unshift(MiniCssExtractPlugin.loader)
  postCSSPlugins.push(require('cssnano'))
  config.output = {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, 'docs')
  }
  config.mode = 'production'
  config.optimization = {
    splitChunks: { chunks: 'all' }
  }
  config.plugins.push(
    new CleanWebpackPlugin(), 
    new MiniCssExtractPlugin({ filename: 'styles.[chunkhash].css' }),
    new RunAfterCompile()
    )
}

module.exports = config