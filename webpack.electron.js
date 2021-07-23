const path = require("path");

module.exports = {
  // Build Mode
  mode: "development",
  // Electron Entrypoint
  entry: "./src/main/main.ts",
  target: "electron-main",
  resolve: {
    alias: {
      ["@"]: path.resolve(__dirname, "src", "main"),
    },
    extensions: [".tsx", ".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: /src/,
        use: [{ loader: "ts-loader" }],
      },
    ],
  },
  output: {
    path: __dirname + "/dist",
    filename: "main.js",
  },
};

// Removed pre load config
// module.exports = {
//   // Build Mode
//   mode: "development",
//   // Electron Entrypoint
//   entry: "./src/preload.ts",
//   target: "electron-preload",
//   resolve: {
//     alias: {
//       ["@"]: path.resolve(__dirname, "src"),
//     },
//     extensions: [".tsx", ".ts", ".js"],
//   },
//   module: {
//     rules: [
//       {
//         test: /\.ts$/,
//         include: /src/,
//         use: [{ loader: "ts-loader" }],
//       },
//     ],
//   },
//   output: {
//     path: __dirname + "/dist",
//     filename: "preload.js",
//   },
// };
