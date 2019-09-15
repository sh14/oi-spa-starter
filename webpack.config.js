const path = require('path')
const glob = require('glob')

const HtmlWebpackPlugin = require('html-webpack-plugin')

const BrowserSyncPlugin = require('browser-sync-webpack-plugin')

// modules for css minification and trash removing
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const PurgecssPlugin    = require('purgecss-webpack-plugin')

const PATHS = {
  src: path.join(__dirname, 'src')
}

module.exports = {
  mode: 'development',
  // mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/bundle.min.js'
  },
  devServer: {
    // при запуске дев сервера будет мониториться эта папка
    contentBase: 'dist',
    overlay: true,
    hot: true,
    port: 80666,
    historyApiFallback: true
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        use: ['pug-loader']
      },
      {
        test: /\.s(c|a)ss$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader', 'sass-loader',],
          fallback: 'style-loader'
        })
      }
    ]
  },
  // devtool: 'inline-source-map',
  plugins: [
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 8666,
      // watch for pointed directory
      server: { baseDir: ['dist'] }
    }),
    // определение подключаемого файла стилей
    new ExtractTextPlugin('./css/styles.css?[hash]'),

    // определение css файлов, которые будут минимизированны
    new PurgecssPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
      whitelistPatterns: [/selectize-.*/]
    }),
    // определение шаблона
    new HtmlWebpackPlugin({ template: './src/index.pug' })
  ]
}
