import path from 'path';
import webpack from 'webpack';
import ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
import SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin');

const config: webpack.Configuration = {
  output: {
    path: path.join(__dirname, '/../dist'),
    filename:
      process.env.NODE_ENV === 'production' ? 'app.[hash].js' : 'app.js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@': path.join(__dirname, '/../src')
    }
  },
  module: {
    rules: [
      {
        test: /\.(tsx?|jsx?)$/,
        enforce: 'pre',
        include: path.join(__dirname, '/../src'),
        loader: 'eslint-loader'
      },
      {
        test: /\.tsx?$/,
        use: [
          'babel-loader',
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|gif|woff|woff2|ttf|svg|eot)(\?|\?[a-z0-9]+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'assets/[hash].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new ForkTsCheckerWebpackPlugin(),
    // @ts-ignore
    new SimpleProgressWebpackPlugin()
  ]
};

export default config;
