const common = require("./webpack.common.js");
const merge = require("webpack-merge");

module.exports = merge(common, {
    mode: "production",
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.(jpg|png|gif|svg)$/,
                use: {
                    loader: "image-webpack-loader",
                },
                // Specify enforce: 'pre' to apply the loader
                // before url-loader/svg-url-loader
                // and not duplicate it in rules with them
                enforce: "pre",
            },
        ],
    },
});
