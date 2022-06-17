const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const devServer = (develop) =>
  !develop
    ? {}
    : {
        devServer: {
          open: true,
          port: 'auto',
          static: {
            directory: './src/',
            watch: true,
          },
        },
      };

module.exports = ({ develop }) => ({
  mode: develop ? 'development' : 'production',
  devtool: develop ? 'inline-source-map' : false,
  entry: './src/index.ts',
  output: {
    path: path.join(__dirname, '/dist'),
    filename: './bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|svg|webp)$/i,
        type: 'asset/inline',
      },
      {
        test: /\.(?:mp3|wav|ogg|mp4)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf)$/i,
        type: 'asset/inline',
      },
      {
        test: /\.html$/i,
        use: ['html-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: 'css/styles.[contenthash].css' }),
    new HtmlWebpackPlugin({
      title: 'Christmas tree',
      template: './src/index.html',
    }),
    new CopyPlugin({
      patterns: [
        {
          from: '**/*',
          //to: '**/*',  // by default saves to the root of 'dist'
          context: path.resolve(__dirname, 'src'),
          globOptions: {
            ignore: ['**/*.js', '**/*.ts', '**/*.scss', '**/*.sass', '**/*.html'],
          },
          noErrorOnMissing: true,
          force: true,
        },
      ],
    }),
    new CleanWebpackPlugin(),
  ],
  ...devServer(develop),
});
