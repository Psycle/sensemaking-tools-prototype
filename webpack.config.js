const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

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
    filename: 'bundle.js',
    path: path.resolve(__dirname, OUTPUT_FOLDER),
  },
  plugins: [
    // Copy index.html to /docs
    new CopyPlugin({
      patterns: [
        { from: 'public', to: '.' },
      ],
    }),
  ],
};
