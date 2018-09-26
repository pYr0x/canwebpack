const path = require("path");
const process = require("process");
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const NODE_ENV = process.env.NODE_ENV;
const isProd = function() {
  return (process.env.NODE_ENV === 'production') ? true : false;
};
const buildingForLocal = () => {
  return (NODE_ENV === 'development');
};
const setPublicPath = () => {
  let env = NODE_ENV;
  if (env === 'production') {
    return 'https://your-host.com/production/';
  } else if (env === 'staging') {
    return 'https://your-host.com/staging/';
  } else {
    return '/';
  }
};

const resolve = function (dir) {
  return path.join(__dirname, dir)
};

module.exports = {
  //context: path.resolve(__dirname, '../'),
  entry: './src/app.js',
  output: {
    //filename: "foo.js",
    filename: '[name].[contenthash].js',
    chunkFilename: "[name].[chunkhash].js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new ManifestPlugin(),
    new HtmlWebpackPlugin({
      title: 'Output Management',
      template: './src/index.html'
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      //filename: "[name].css",
      chunkFilename: "[name].[contenthash].css"
    }),
    new webpack.HashedModuleIdsPlugin()
  ],
  resolve: {
    alias: {
      '~': resolve('src'),
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env'],
            plugins: [require('@babel/plugin-syntax-dynamic-import')]
          }
        }
      },
      {
        test: /\.stache$/,
        use: {
          loader: 'can-stache-loader'
        }
      },
      {
        test: /\.css$/,
        //use: [ 'style-loader', 'css-loader' ]
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          "css-loader"
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[name].[ext]'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  },
  optimization: {
    minimize: false,
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
};