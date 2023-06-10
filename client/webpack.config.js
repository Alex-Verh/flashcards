const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

// Pages list
pages = ["main", "cardsets", "register", "login", "set"];

const filename = (ext = "[ext]") =>
  mode === "production" ? `[name].[hash]${ext}` : `[name]${ext}`;

const baseBuildDir = () => (forFlask ? "../server/app" : "build");
const staticBuildDir = () => (forFlask ? "static/" : "");
const templatesBuildDir = () => (forFlask ? "templates/" : "");

const cleanBuildDir = () => mode !== "production";

const entry = () =>
  pages.reduce(
    (config, page) => ({
      ...config,
      [page]: `./js/${page}.js`,
    }),
    {}
  );

const output = () => ({
  filename: staticBuildDir() + "js/" + filename(".js"),
  path: path.resolve(__dirname, baseBuildDir()),
  clean: cleanBuildDir(),
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
  static: path.resolve(__dirname, "build"),
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
    test: /\.(png|svg|jpg|jpeg|gif)$/i,
    type: "asset/resource",
    generator: {
      filename: staticBuildDir() + "img/" + filename(),
    },
  },
  {
    test: /-ico\.svg$/i,
    type: "asset/resource",
    generator: {
      filename: staticBuildDir() + "img/icons/" + filename(),
    },
  },
  {
    test: /\.(woff|woff2|eot|ttf|otf)$/i,
    type: "asset/resource",
    generator: {
      filename: staticBuildDir() + "fonts/" + filename(),
    },
  },
  {
    test: /\.html$/i,
    loader: "html-loader",
    options: {
      sources: true,
    },
  },
];

const htmlPlugins = () =>
  pages.map(
    (page) =>
      new HtmlWebpackPlugin({
        inject: true,
        template: `./pages/${page}.html`,
        filename: templatesBuildDir() + `${page}.html`,
        chunks: [page],
      })
  );

const plugins = () => [
  ...htmlPlugins(),
  new MiniCssExtractPlugin({
    filename: staticBuildDir() + "css/" + filename(".css"),
  }),
];

module.exports = (env) => {
  global.mode = env.MODE;
  global.forFlask = env.FOR_FLASK;
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
