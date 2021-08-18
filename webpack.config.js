const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = (env, argv) => {
  return {
    entry: './src/main.js',
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "bundle.js",
      library: "Perse",
      libraryTarget: "umd",
      globalObject: "this"
    },
    module: {
      rules: [
        {
          test: /\.(js)$/,
          exclude: /node_modules/,
          use: "babel-loader",
        },
      ],
    },
    resolve: {
      extensions: ['.js']
    },
    plugins: [],
    devtool: 'inline-source-map'
  }
};
