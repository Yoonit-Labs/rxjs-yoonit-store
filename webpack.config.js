const path = require('path');
const nodeExternals = require('webpack-node-externals');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

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
    plugins: [
      new BundleAnalyzerPlugin()
    ],
    devtool: 'inline-source-map'
  }
};
