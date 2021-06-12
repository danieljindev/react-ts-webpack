import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { Configuration, DefinePlugin } from 'webpack';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

module.exports = (): Configuration => ({
  entry: path.join(__dirname, 'src', 'index.tsx'),
  ...(process.env.production || !process.env.development
    ? {}
    : { devtool: 'eval-source-map' }),
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].[fullhash].bundle.js',
    publicPath: '/',
  },
  mode: 'development',
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    // This plugin creates those 'alias' entries from 'paths' entries in your 'tsconfig.json'
    plugins: [new TsconfigPathsPlugin({ configFile: './tsconfig.json' })],
  },
  devServer: {
    contentBase: path.join(__dirname, 'src'),
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
      },
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
    // HtmlWebpackPlugin simplifies creation of HTML files to serve your webpack bundles
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index.html'),
    }),
    // DefinePlugin allows you to create global constants which can be configured at compile time
    new DefinePlugin({
      'process.env': process.env.production || !process.env.development,
    }),
  ],
});
