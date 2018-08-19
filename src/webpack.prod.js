const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  plugins:[
    new UglifyJSPlugin({
      uglifyOptions: {
        warnings: false,
        output: {
          comments: false,
          beautify: false,
        }
      }
    }),
    new webpack.DefinePlugin({
      'argv.env': JSON.stringify('production'),
    })
  ]
});
