const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

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
    watch: true,
    output: {
        publicPath: '/',
        path: path.join(__dirname, '..'),
        filename: 'dist/js/[name].[contenthash].js',
        assetModuleFilename: 'assets/imgs/[hash][ext][query]'
    },
    mode: 'development',
    watch: true,
    devtool: 'source-map',
    plugins: [
        htmlWebpack,
        new MiniCssExtractPlugin({
            filename: 'assets/css/[name].[contenthash].css'
        }),
        new FilesListPlugin(),
        new BundleAnalyzerPlugin(),
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
    devServer: {
        static: path.join(__dirname, ''),
        compress: true,
        historyApiFallback: true,
        port: 3030,
        open: true,
    },
}