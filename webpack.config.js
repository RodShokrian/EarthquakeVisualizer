var path = require('path');
var webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './24hour.html',
  filename: '24hour.html',
  inject: 'body'
})

module.exports = {
  context: __dirname,
  entry: "./24hour.js",
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {
        test: [/\.jsx?$/, /\.js?$/],
        exclude: /node_modules/,
        loader: 'babel-loader',
      }
    ]
  },
  devtool: 'source-maps',
	plugins: [HtmlWebpackPluginConfig]
};
