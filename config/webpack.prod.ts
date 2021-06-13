import { Configuration, SourceMapDevToolPlugin } from 'webpack'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { merge } from 'webpack-merge'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'

import commonConfig from './webpack.common'

// Disable React DevTools in production
const disableReactDevtools = `
<script>
if (typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ === 'object') {
   __REACT_DEVTOOLS_GLOBAL_HOOK__.inject = function() {};
}
</script>
`

const prodConfig = (): Configuration =>
  merge(commonConfig, {
    mode: 'production',
    devtool: false,
    module: {
      rules: [
        // Styles
        {
          test: /\.(scss|css)$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
              },
            },
            'sass-loader',
          ],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'styles/[name].[contenthash].css',
        chunkFilename: 'styles/[name].[id].[contenthash].css',
        ignoreOrder: false,
      }),
      new HtmlWebpackPlugin({
        template: './public/index.html',
        favicon: './public/favicon.ico',
        hash: true,
        disableReactDevtools,
      }),
      new SourceMapDevToolPlugin({
        exclude: ['/node_modules/'],
      }),
    ],
    performance: {
      hints: 'warning',
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    },
    optimization: {
      minimizer: [new CssMinimizerPlugin(), '...'],
      runtimeChunk: 'multiple',
      splitChunks: {
        // Cache vendors since this code won't change very often
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/](react|react-dom|axios|redux|react-redux)[\\/]/,
            name: 'vendors',
            chunks: 'all',
            enforce: true,
          },
        },
      },
    },
  })

export default prodConfig
