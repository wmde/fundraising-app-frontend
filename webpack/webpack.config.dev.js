/* eslint-disable */
'use strict';

const webpack              = require('webpack');
const { merge }            = require('webpack-merge');
//const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const helpers              = require('./helpers');
const commonConfig         = require('./webpack.config.common');
const environment          = require('./env/dev.env');

const webpackConfig = merge(commonConfig, {
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    plugins: [
        new webpack.EnvironmentPlugin(environment),
        new webpack.HotModuleReplacementPlugin(),
//        new FriendlyErrorsPlugin()
    ],
    devServer: {
        compress: true,
        historyApiFallback: true,
        hot: true,
        open: false,
        overlay: true,
        port: 7072,
        stats: {
            normal: true
        },
		contentBase: 'public'
    }
});

module.exports = webpackConfig;
