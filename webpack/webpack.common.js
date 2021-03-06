/* eslint-disable */
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
/* eslint-enable */
module.exports = () => {
  return {
    entry: ['./webapp/app/index'],
    resolve: {
      extensions: [
        '.js', '.jsx'
      ],
      modules: ['node_modules']
    },
    module: {
      rules: [
        {
          test: /\.json/,
          loaders: ['json-loader']
        }, {
          test: /\.css$/,
          loaders: ['style-loader', 'css-loader']
        }, {
          test: /\.scss$/,
          loaders: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
        }, {
          test: /\.(jpe?g|png|gif|svg|woff|woff2|ttf|eot)$/i,
          loaders: [
            'file-loader?hash=sha512&digest=hex&name=[hash].[ext]', {
              loader: 'image-webpack-loader',
              query: {
                gifsicle: {
                  interlaced: false
                },
                optipng: {
                  optimizationLevel: 7
                }
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new CopyWebpackPlugin([
        {
          from: './node_modules/swagger-ui/dist',
          to: 'swagger-ui/dist'
        }, {
          from: './webapp/swagger-ui/',
          to: 'swagger-ui'
        }, {
          from: './webapp/static/',
          to: 'static'
        }, {
          from: './webapp/favicon.ico',
          to: 'favicon.ico'
        }, {
          from: './webapp/robots.txt',
          to: 'robots.txt'
        }
      ]),
      new HtmlWebpackPlugin({
        template: './webapp/index.html',
        chunksSortMode: 'dependency',
        inject: 'body'
      }),
      new ExtractTextPlugin('styles.css')
    ]
  };
};
