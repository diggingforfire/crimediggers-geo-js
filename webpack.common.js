const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/index.js",
    plugins: [
        new HtmlWebpackPlugin({
            title: "Crimediggers GEO",
            hash: true,
            inject: false,
            template: require("html-webpack-template"),
            appMountId: "app",
            lang: "en",
            mobile: true,
            favicon: "./src/assets/favicon.png",
        }),
    ],
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "main.js",
        publicPath: "/",
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ["babel-loader", "eslint-loader"],
            },
            {
                test: /\.(s*)css$/,
                exclude: /node_modules/,
                use: ["style-loader", "css-loader", "sass-loader"],
            },
            {
                test: /\.(woff|woff2|eot|ttf|svg)$/,
                use: [
                    {
                        loader: "file-loader",
                    },
                ],
            },
            {
                test: /\.(jpg|png)$/,
                use: {
                    loader: "url-loader",
                    options: {
                        limit: 10 * 1024,
                    },
                },
            },
        ],
    },
};
