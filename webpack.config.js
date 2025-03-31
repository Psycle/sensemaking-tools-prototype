const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const OUTPUT_FOLDER = "docs";

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'chunks/[name].js', // Output chunks within the 'chunks' folder
    path: path.resolve(__dirname, OUTPUT_FOLDER),
    clean: true, // Ensures output folder cleanup (alternative to CleanWebpackPlugin)
  },
  plugins: [
    // Clean the output folder before each build
    new CleanWebpackPlugin(),

    // Copy index.html and other files from 'public' to 'docs'
    new CopyPlugin({
      patterns: [
        { from: 'public', to: '.' },
      ],
    }),
  ],
};
