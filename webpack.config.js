var path = require('path');
var webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './index.html',
  filename: 'index.html',
  inject: 'body'
})

module.exports = {
  context: __dirname,
  entry: [
		"./main.js"
		],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: "bundle.js"
  },
  devtool: 'source-maps',
	plugins: [HtmlWebpackPluginConfig]
};
