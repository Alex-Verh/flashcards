const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

// Pages list
pages = ["main", "cardsets", "register", "login", "set"];

const filename = (ext = "[ext]") =>
  mode === "production" ? `[name].[hash]${ext}` : `[name]${ext}`;

const entry = () =>
  pages.reduce(
    (config, page) => ({
      ...config,
      [page]: `./js/${page}.js`,
    }),
    {}
  );

const output = () => ({
  filename: filename(".js"),
  path: path.resolve(__dirname, "dist"),
  clean: true,
});

const optimization = () => {
  const optimizationConfig = {
    splitChunks: {
      chunks: "all",
    },
  };
  if (mode === "production")
    optimizationConfig.minimizer = [
      new TerserPlugin(),
      new CssMinimizerPlugin(),
    ];
};

const devServer = () => ({
  static: path.resolve(__dirname, "dist"),
  open: true,
});

const devtool = () => (mode === "production" ? "source-map" : "eval");

const rules = () => [
  {
    test: /\.css$/i,
    use: [MiniCssExtractPlugin.loader, "css-loader"],
  },
  {
    test: /\.s[ac]ss$/i,
    use: [
      MiniCssExtractPlugin.loader,
      "css-loader",
      // {
      //   loader: "postcss-loader",
      //   options: {
      //     postcssOptions: {
      //       plugins: [["autoprefixer"]],
      //     },
      //   },
      // },
      "sass-loader",
    ],
  },
  {
    test: /-ico\.(svg)/i,
    type: "asset/resource",
    generator: {
      filename: "img/icons/" + filename(),
    },
  },
  {
    test: /\.(png|svg|jpg|jpeg|gif)$/i,
    type: "asset/resource",
    generator: {
      filename: "img/" + filename(),
    },
  },
  {
    test: /\.(woff|woff2|eot|ttf|otf)$/i,
    type: "asset/resource",
    generator: {
      filename: "fonts/" + filename(),
    },
  },
  {
    test: /\.html$/i,
    loader: "html-loader",
  },
];

const htmlPlugins = () =>
  pages.map(
    (page) =>
      new HtmlWebpackPlugin({
        inject: true,
        template: `./pages/${page}.html`,
        filename: `${page}.html`,
        chunks: [page],
      })
  );

const plugins = () => [
  ...htmlPlugins(),
  new MiniCssExtractPlugin({
    filename: "css/" + filename(".css"),
  }),
];

module.exports = (env) => {
  global.mode = env.MODE;
  return {
    context: path.resolve(__dirname, "src"),
    mode: mode,
    entry: entry(),
    output: output(),
    optimization: optimization(),
    devServer: devServer(),
    devtool: devtool(),
    module: {
      rules: rules(),
    },
    plugins: plugins(),
  };
};
