// webpack --config example/webpack.config.js

var IncWebpackPlugin = require('../');

var bundleName = '[name]-output.js';

module.exports = {
    context: __dirname,
    entry: './example.js',
    output: {
        path: __dirname,
        filename: bundleName,
        chunkFilename: bundleName
    },
    plugins: [
        new IncWebpackPlugin()
    ]
};