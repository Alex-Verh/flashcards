const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

// Pages list
const pages = ["main", "cardsets", "register", "login", "set"];

const paths = {
  src: path.resolve(__dirname, "./src"),
  dist: path.resolve(__dirname, "./dist"),
  assets: "static/",
};

const filename = (ext = "[ext]") =>
  mode === "production" ? `[name].[hash]${ext}` : `[name]${ext}`;

const distPath = () =>
  flask ? path.resolve(__dirname, "../server/app/static") : paths.dist;
const templatesPath = () => (flask ? "../templates/" : "");
const assetsPath = () => (flask ? "" : paths.assets);
const publicPath = () => (flask ? paths.assets : "");

const entry = () =>
  pages.reduce(
    (config, page) => ({
      ...config,
      [page]: `./js/${page}.js`,
    }),
    {}
  );
const output = () => ({
  filename: `${assetsPath()}js/${filename(".js")}`,
  path: distPath(),
  publicPath: publicPath(),
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
  static: paths.dist,
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
      {
        loader: "postcss-loader",
        options: {
          postcssOptions: {
            plugins: [["autoprefixer"]],
          },
        },
      },
      "sass-loader",
    ],
  },
  {
    test: /\.(png|svg|jpg|jpeg|gif)$/i,
    type: "asset/resource",
    generator: {
      filename: `${assetsPath()}img/[name][ext]`,
    },
  },
  {
    test: /-ico\.svg$/i,
    type: "asset/resource",
    generator: {
      filename: `${assetsPath()}img/icons/[name][ext]`,
    },
  },
  {
    test: /\.(woff|woff2|eot|ttf|otf)$/i,
    type: "asset/resource",
    generator: {
      filename: `${assetsPath()}fonts/[name][ext]`,
    },
  },
  // {
  //   test: /\.html$/i,
  //   loader: "html-loader",
  //   options: {
  //     sources: true,
  //   },
  // },
];
const htmlPlugins = () =>
  pages.map(
    (page) =>
      new HtmlWebpackPlugin({
        inject: false,
        template: `./pages/${page}.html`,
        filename: templatesPath() + `${page}.html`,
        chunks: [page],
      })
  );

const plugins = () => [
  ...htmlPlugins(),
  new MiniCssExtractPlugin({
    filename: `${assetsPath()}css/${filename(".css")}`,
  }),
  new CopyWebpackPlugin({
    patterns: [
      {
        from: `img`,
        to: `${assetsPath()}img`,
      },
      { from: "pages/modal", to: `${templatesPath()}modal` },
      {
        from: "pages/base.html",
        to: `${templatesPath()}base.html`,
      },
    ],
  }),
];

module.exports = (env) => {
  global.mode = env.MODE;
  global.flask = env.FLASK;
  return {
    context: paths.src,
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
