const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");
const webpack = require("webpack");

module.exports = {
  entry: {
    background: path.resolve("src/background/background.ts"),
    contentScript: path.resolve("src/contentScript/index.tsx"),
    script: path.resolve("src/inject/index.tsx"),
    wallet: path.resolve("src/inject/wallet.tsx"),
    bonktweet: path.resolve("src/solana/bonktweet.ts"),
    utilities: path.resolve("src/solana/utilities.ts"),
    programIdl: path.resolve("src/solana/program-idl.ts"),
  },
  module: {
    rules: [
      {
        use: "ts-loader",
        test: /\.tsx?$/,
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: "postcss-loader", // postcss loader needed for tailwindcss
            options: {
              postcssOptions: {
                ident: "postcss",
                plugins: [tailwindcss, autoprefixer],
              },
            },
          },
        ],
      },
      {
        type: "assets/resource",
        test: /\.(png|jpg|jpeg|gif|woff|woff2|tff|eot|svg)$/,
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
    }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("development"),
      },
    }),
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve("src/static"),
          to: path.resolve("dist"),
        },
      ],
    }),
    ...getHtmlPlugins(["popup", "options", "newTab"]),
  ],
  // externals: [
  //   function (ctx, callback) {
  //     // The external is a `commonjs2` module located in `@scope/library`
  //     callback(null, "@solana/web3.js", "commonjs2");
  //   },
  // ],
  resolve: {
    extensions: [".tsx", ".js", ".ts"],
    fallback: {
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
      fs: false,
    },
  },
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "dist"),
  },
  optimization: {
    splitChunks: {
      chunks(chunk) {
        return chunk.name !== "contentScript";
      },
    },
  },
};

function getHtmlPlugins(chunks) {
  return chunks.map(
    (chunk) =>
      new HtmlPlugin({
        title: "React Extension",
        filename: `${chunk}.html`,
        chunks: [chunk],
      })
  );
}
