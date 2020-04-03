var path = require('path');

module.exports = {
    entry: ['./script.js', './style.sass'],
    output: {
        filename: 'script_bundle.js',
        path: path.resolve(__dirname)
    },
    resolve: {alias: {vue: 'vue/dist/vue.esm.js'}},
    module: {
        rules: [
            {
                test: /\.(sass|scss)$/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader" // translates CSS into CommonJS
                }, {
                    loader: "sass-loader" // compiles Sass to CSS
                }]
            }
        ]
    },
};