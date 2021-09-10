const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = (env, argv) => {
  return {
    externals: [nodeExternals()],
    entry: {
      main: './src/main.js',
      vuePlugin: './src/plugins/vue.js'
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].bundle.js",
      library: "Yoox",
      libraryTarget: "umd",
      globalObject: "this"
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
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
