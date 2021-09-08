const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = (env, argv) => {
  return {
    entry: './src/main.js',
    externals: [nodeExternals()],
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "bundle.js",
      library: "Yoox",
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
