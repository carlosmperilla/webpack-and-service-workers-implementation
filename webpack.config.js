const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const htmlWebpack = new HtmlWebpackPlugin({
    inject: true,
    template: './assets/index.template.html',
    filename: 'index.html'
})

// Using workbox was too much for the purpose of the project.
// Credits Caciano:
// https://stackoverflow.com/a/66338052
function FilesListPlugin() {
    FilesListPlugin.prototype.apply = compiler => {
    compiler.hooks.emit.tapAsync('FileListPlugin', (compilation, callback) => {
        const filelist = Object.keys(compilation.assets).map(fileName => `'/${fileName}'`);
        compilation.assets['filesList.js'] = {
            source: () => `const getFilesList = () => [${filelist}]`,
            size: () => filelist.length,
        };
        callback();
    });
};
};

module.exports = {
    entry: './assets/js/entry.js',
    output: {
        publicPath: '/',
        path: path.join(__dirname, '..'),
        filename: 'dist/js/[name].[contenthash].js',
        assetModuleFilename: 'assets/imgs/[hash][ext][query]'
    },
    mode: 'production',
    plugins: [
        htmlWebpack,
        new MiniCssExtractPlugin({
            filename: 'assets/css/[name].[contenthash].css'
        }),
        new FilesListPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                  loader: "babel-loader"
                },
                exclude: /node_modules/
            },
            {
                test: /\.(css|scss|sass)$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            },
            {
                test: /\.(jpg|svg)$/,
                type: "asset/resource"
            },
            {
                test: /\.ttf$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 1000,
                        mimetype: "font/ttf",
                        name: "[name].[ext]",
                        outputPath: "./assets/fonts/",
                        publicPath: "./assets/fonts/",
                        esModule: false
                    }
                }
            },
        ]
    },
    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin(),
            new TerserPlugin(),
        ]
    },
    distDir: 'dist',
}