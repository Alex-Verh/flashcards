const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const htmlPlugin = (name) =>
  new HtmlWebpackPlugin({
    template: `./templates/${name}.html`,
    filename: `${name}.html`,
    chunks: [name],
    minify: {
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeStyleLinkTypeAttributes: true,
      removeScriptTypeAttributes: true,
      removeAttributeQuotes: true,
      useShortDoctype: true,
    },
  });

module.exports = (env, argv) => ({
  context: path.resolve(__dirname, "src"),
  mode: "development",
  entry: {
    main: "./js/main.js",
    // cards: "./cards.js",
    // cardsets: "./cardsets.js",
    // login: "./login.js",
    // register: "./register.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  devServer: {
    static: path.resolve(__dirname, "dist"),
  },
  optimization: {
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.s[ac]ss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
        generator: {
          filename: "img/[name].[hash][ext]",
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: "fonts/[name].[hash][ext]",
        },
      },
    ],
  },
  plugins: [
    htmlPlugin("main"),
    // htmlPlugin("cards"),
    // htmlPlugin("cardsets"),
    // htmlPlugin("login"),
    // htmlPlugin("register"),
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
    }),
  ],
});
