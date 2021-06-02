const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/renderer.tsx",
  target: "electron-renderer",
  devtool: "source-map",
  devServer: {
    contentBase: path.join(__dirname, "dist/renderer.js"),
    compress: true,
    port: 9000,
  },
  resolve: {
    alias: {
      ["@"]: path.resolve(__dirname, "src"),
    },
    extensions: [".tsx", ".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        include: /src/,
        use: [{ loader: "ts-loader" }],
      },
      {
        test: /\.css$/i,
        include: path.resolve(__dirname, "src"),
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ],
  },
  output: {
    path: __dirname + "/dist",
    filename: "renderer.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
};
