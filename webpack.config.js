const path = require("path");

// Plugins
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// Configuration
const OUTPUT_FOLDER = "site";

module.exports = {
  devtool: "source-map",
  mode: "development",
  entry: {
    bundle: "./src/index.ts", 
    styles:  "./src/styles.scss"
  },
  output: {
    filename: "assets/js/[name].js",
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
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: "sass-loader",
            options: {
              sassOptions: {
                quietDeps: true, // Suppresses deprecation warnings from _glue
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
    // Copy index.html and other files from 'public' to 'docs'
    new CopyPlugin({
      patterns: [
        { from: "public", to: "." },
        { from: "src/index.html", to: "." },
        { from: "_glue/icons/glue-icons.svg", to: "assets/img" },
      ],
    }),

    // Mini CSS
    new MiniCssExtractPlugin({  filename: "assets/css/theme.css",  }),
  ],
};
