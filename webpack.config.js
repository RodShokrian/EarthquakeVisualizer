var path = require('path');
var webpack = require('webpack');

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
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  devtool: 'source-maps',
  resolve: {
    alias: {
      "jquery": path.join(__dirname, "./jquery-stub.js")
    },
    extensions: [".js", ".jsx", "*"]
  }
};
