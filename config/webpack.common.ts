import path from 'path'
import dotenv from 'dotenv'
import { Configuration, DefinePlugin, ProvidePlugin } from 'webpack'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'

const result = dotenv.config()

if (result.error) {
  throw result.error
}

const commonConfig: Configuration = {
  // context: __dirname, // to automatically find tsconfig.json
  entry: path.join(__dirname, '../src', 'index.tsx'),
  output: {
    path: path.join(__dirname, '../build'),
    filename: '[name].[fullhash].bundle.js',
    publicPath: '/',
  },
  mode: 'development',
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    // This plugin creates those 'alias' entries from 'paths' entries in your 'tsconfig.json'
    plugins: [new TsconfigPathsPlugin({ configFile: path.join(__dirname, '../tsconfig.json') })],
  },
  devServer: {
    contentBase: path.join(__dirname, '../src'),
  },
  module: {
    rules: [
      /**
       * TypeScript (.ts/.tsx files)
       *
       * The TypeScript loader will compile all .ts/.tsx files to .js. Babel is
       * not necessary here since TypeScript is taking care of all transpiling.
       */
      {
        test: /\.ts(x?)$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          // disable type checker - we will use it in fork plugin
          transpileOnly: true,
        },
      },
      // Fonts
      {
        test: /\.(woff(2)?|eot|ttf|otf)$/,
        type: 'asset/inline',
      },
      // Markdown
      {
        test: /\.md$/,
        type: 'asset/source',
      },
      // Images
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|webp|svg)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    // DefinePlugin allows you to create global constants which can be configured at compile time
    new DefinePlugin({
      'process.env': JSON.stringify(result.parsed),
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../public'),
          globOptions: {
            ignore: ['**/index.html', '**/favicon.ico'],
          },
        },
      ],
    }),
    new ForkTsCheckerWebpackPlugin({
      // Speeds up TypeScript type checking and ESLint linting (by moving each to a separate process)
      eslint: {
        files: './src/**/*.{tsx,ts,js,jsx}',
      },
    }),
    // fix "process is not defined" error:
    new ProvidePlugin({
      process: 'process/browser',
    }),
  ],
}

export default commonConfig
