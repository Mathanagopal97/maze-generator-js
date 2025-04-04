const path = require("path");

module.exports = {
  entry: "./src/index.ts", // Your main entry file
  output: {
    filename: "bundle.js", // Output bundle filename
    path: path.resolve(__dirname, "dist"), // Output directory
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
};
