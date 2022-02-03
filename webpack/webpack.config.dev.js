'use strict';

const webpack = require( 'webpack' );
const { merge } = require( 'webpack-merge' );
const commonConfig = require( './webpack.config.common' );
const environment = require( './env/dev.env' );

const webpackConfig = merge( commonConfig, {
	mode: 'development',
	devtool: 'eval-cheap-module-source-map',
	plugins: [
		new webpack.EnvironmentPlugin( environment ),
	],
	devServer: {
		compress: true,
		historyApiFallback: true,
		hot: true,
		open: false,
		client: {
			overlay: true,
		},
		port: 7072,
		devMiddleware: {
			stats: { normal: true },
		},
		static: 'public',
	},
} );

module.exports = webpackConfig;
