const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const terserWebpackPlugin = require('terser-webpack-plugin');
const miniCssExtractPlugin = require('mini-css-extract-plugin');
const htmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const webpackCleanPlugin = require('webpack-clean');
const optimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const cleanCSS = require('clean-css');

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.join(__dirname, '/public'),
    publicPath: '/',
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.js$/,
        use: ['source-map-loader'],
        enforce: 'pre',
      },
      {
        test: /\.css$/,
        use: [miniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.ts', '.tsx'],
  },
  plugins: [
    new miniCssExtractPlugin(),
    new htmlWebpackPlugin({
      template: './src/index.html',
      inlineSource: '.(js|css)$',
      minify: { collapseWhitespace: true },
    }),
    new htmlWebpackInlineSourcePlugin(),
    new CopyPlugin([{ from: './_redirects', to: './' }]),
    new webpackCleanPlugin(['./public/main.css', './public/bundle.js']),
  ],
  devtool: 'source-map',
  optimization: {
    minimizer: [
      new terserWebpackPlugin({
        terserOptions: {
          output: {
            comments: false,
            source_map: true,
          },
        },
        extractComments: false,
      }),
      new optimizeCSSAssetsPlugin({
        cssProcessor: cleanCSS,
      }),
    ],
  },
};
