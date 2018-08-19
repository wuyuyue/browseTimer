const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    bundle: path.join(path.resolve(__dirname), 'ui/index.jsx'),
    background: path.join(path.resolve(__dirname), 'scripts/background.js'),
    content: path.join(path.resolve(__dirname), 'scripts/content.js'),
  },
  module: {
    rules: [{
        exclude: /node_modules/,
        test: /\.jsx$/,
        use: ['babel-loader'],
      },
      {
        exclude: /node_modules/,
        test: /\.js$/,
        use: ['babel-loader'],
      },
      {
          test: /\.(styl|css)$/,
          use: ExtractTextPlugin.extract({
            use: [{
              loader: 'css-loader',
              options: {
                minimize: true
              }
            },{
              loader: "stylus-loader"
            }],
          })
      }
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      'ui',
      'node_modules',
    ],
  },
  plugins: [

    new ExtractTextPlugin({
      filename: "bundle.css",
      allChunks: true
    }),

  ],
  output: {
    path: path.join(path.resolve(__dirname), '../app/'),
    filename: '[name].js',
  }
};
