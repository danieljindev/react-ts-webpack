import path from 'path'
import { Configuration, HotModuleReplacementPlugin } from 'webpack'

import { merge } from 'webpack-merge'
import HtmlWebpackPlugin from 'html-webpack-plugin'

import commonConfig from './webpack.common'

const devConfig = (): Configuration =>
  merge(commonConfig, {
    mode: 'development',
    devtool: 'eval-source-map',
    module: {
      rules: [
        // Styles
        {
          test: /\.(scss|css)$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: { sourceMap: true, importLoaders: 1 },
            },
            { loader: 'sass-loader', options: { sourceMap: true } },
          ],
        },
      ],
    },
    devServer: {
      historyApiFallback: true,
      open: true,
      compress: true,
      hot: true,
      port: 3000,
    },
    plugins: [
      new HotModuleReplacementPlugin(),
      // HtmlWebpackPlugin simplifies creation of HTML files to serve your webpack bundles
      new HtmlWebpackPlugin({
        template: path.join(__dirname, '../public', 'index.html'),
        favicon: path.join(__dirname, '../public', 'favicon.ico'),
        hash: true,
      }),
    ],
  })

export default devConfig
