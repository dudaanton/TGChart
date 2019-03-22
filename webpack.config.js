const path = require('path');
const sass = require('sass')
const autoprefixer = require('autoprefixer')
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const NODE_ENV = process.env.NODE_ENV || 'development'

module.exports = {
  context: path.resolve(__dirname, 'src'),

  mode: 'development',
  entry: [
    './index.js',
    './styles/main.sass',
  ],

  optimization: {
    minimizer: [new UglifyJsPlugin()],
  },

  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    watchContentBase: true,
    // hot: true
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader']
      },
      {
        test: /\.sass$/,
        use: [
          // 'style-loader',
          // {
          //   loader: 'postcss-loader',
          //   options: {
          //     plugins: () => autoprefixer
          //   }
          // },
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../'
            }
          },
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: sass
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(svg)$/,
        use: [
          'svg-inline-loader'
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.pug$/,
        use: [
          {
            loader: 'html-loader?attrs=false',
          },
        ],
      }
    ]
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  plugins: [
    new CleanWebpackPlugin(['dist']),
    new webpack.HotModuleReplacementPlugin(),
    // new ExtractTextPlugin({
    //   filename: './css/main.css',
    //   allChunks: true,
    // }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html'
    })
  ],

  output: {
    filename: '[name].js',
    publicPath: '/',
    path: path.resolve(__dirname, 'dist'),
  },
};
