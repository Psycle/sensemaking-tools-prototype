const path = require("path");

// Plugins
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


// Configuration
const OUTPUT_FOLDER = "docs";

module.exports = {
  devtool: "source-map",
  mode: "development",
  entry: "./src/index.ts",
  output: {
    filename: "chunks/[name].js",
    path: path.resolve(__dirname, OUTPUT_FOLDER),
    clean: true, // Ensures output folder cleanup (alternative to CleanWebpackPlugin)
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/i,
        exclude: /_glue/, // Ignore SCSS files in _glue folder
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  [
                    "postcss-preset-env",
                    {
                      features: {
                        "logical-properties-and-values": false,
                      },
                    },
                  ],
                ],
                sourceMap: true,
              },
            },
          },
          {
            loader: "resolve-url-loader",
            options: {
              sourceMap: true,
            },
          },
          {
            loader: "sass-loader",
            options: {
              sassOptions: {
                quietDeps: true, // Suppresses deprecation warnings
              },
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },

  plugins: [
    // Clean the output folder before each build
    new CleanWebpackPlugin(),

    // Copy index.html and other files from 'public' to 'docs'
    new CopyPlugin({
      patterns: [
        { from: "public", to: "." },
        { from: "_glue/icons/glue-icons.svg", to: "assets/img" },
      ],
    }),

    // Mini CSS
    new MiniCssExtractPlugin({
      filename: "assets/css/theme/main.css"
    })
  ],
};