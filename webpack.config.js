const path = require('path');
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StringReplacePlugin = require("string-replace-webpack-plugin");

const UNASSERT_RULE = {
    test: /\.js$/,
    use: [{
        loader: StringReplacePlugin.replace({
            replacements: [
                {
                    pattern: /\n[ \t]*([a-zA-Z0-9_]+.)?assert(\.[a-zA-Z0-9_]+)?\([^;\n]*\)[ \t]*[;\n]/g,
                    replacement: function (match, p1, offset, string) {
                        //strip
                        return "";
                    }
                }
            ]
        })
    }]
};


module.exports = (env, argv) => {
    const defines = {};

    const plugins = [
        new HtmlWebpackPlugin({
            title: 'Development',
        }),
    ];

    const moduleRules = [];

    if (argv.mode === "production") {
        defines.ENV_PRODUCTION = true;
        plugins.push(new StringReplacePlugin());
        moduleRules.push(UNASSERT_RULE);
    }

    plugins.push(new webpack.DefinePlugin(defines));

    return {
        mode: "development",
        devtool: 'inline-source-map',
        entry: './src/Demo.js',
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, 'dist'),
        },
        module: {
            rules: moduleRules
        },
        plugins: plugins,
        devServer: {
            static: './dist',
        },
        optimization: {
            runtimeChunk: 'single',
        },
    };
};
