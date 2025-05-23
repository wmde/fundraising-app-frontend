'use strict';

import webpack from 'webpack';
import { merge } from 'webpack-merge';
import commonConfig from './webpack.config.common.mjs';
import environment from './env/dev.env.mjs';

const webpackConfig = merge( commonConfig, {
	mode: 'development',
	devtool: 'eval-cheap-module-source-map',
	plugins: [
		new webpack.EnvironmentPlugin( environment ),
		new webpack.DefinePlugin( {
			__VUE_OPTIONS_API__: true,
			__VUE_PROD_DEVTOOLS__: true,
		} ),
	],
	devServer: {
		compress: true,
		historyApiFallback: true,
		hot: false,
		liveReload: false,
		open: false,
		client: {
			overlay: true,
		},
		port: 7072,
		devMiddleware: {
			stats: { normal: true },
		},
		static: [ 'public', {
			directory: 'src/pattern_library/css',
			publicPath: '/pattern_library',
		} ],
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
			'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
		},
	},
} );

export default webpackConfig;
