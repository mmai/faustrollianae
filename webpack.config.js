var path = require('path');
var webpack = require('webpack');
 
module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: /.jsx?$/, exclude: /node_modules/, loader: 'babel-loader' },
      // { test: require.resolve("material-design-lite/material"), loader: "exports?componentHandler" },
      { test: /node_modules\/material-design-lite\/material.min.js$/, loader: 'exports-loader' },
      { test: /node_modules\/material-design-lite\/material.min.css$/, loader: "style!css" },
      { test: /\.scss$/, exclude: /node_modules/, loader: "style!css!sass" }
    ]
  },
};
