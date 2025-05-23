'use strict';

import webpack from 'webpack';
import path from 'path';
import { merge } from 'webpack-merge';
import MiniCSSExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';
import helpers from './helpers.mjs';
import commonConfig from './webpack.config.common.mjs';
import environment from './env/prod.env.mjs';

const webpackConfig = merge( commonConfig, {
	mode: 'production',
	devtool: 'source-map',
	optimization: {
		minimize: true,
		minimizer: [
			new CssMinimizerPlugin( {
				minimizerOptions: {
					preset: [ 'default', { discardComments: { removeAll: true } } ],
				},
			} ),
			new TerserPlugin( {
				parallel: true,
			} ),
		],
		moduleIds: 'deterministic',
	},
	output: {
		filename: 'js/[name].[chunkhash].js',
		clean: true,
	},
	resolve: {
		alias: {
			'vue-i18n': 'vue-i18n/dist/vue-i18n.esm-browser.prod.js',
		},
	},
	plugins: [
		new webpack.EnvironmentPlugin( environment ),
		new webpack.DefinePlugin( {
			__VUE_OPTIONS_API__: true,
			__VUE_PROD_DEVTOOLS__: false,
		} ),
		new WebpackManifestPlugin( {
			filter: ( { name } ) => name.endsWith( '.js' ) || name.endsWith( '.css' ),
			generate( seed, files ) {
				return files.reduce( ( manifest, file ) => {
					const dir = path.relative( '/', path.parse( file.path ).dir );
					manifest[ `${dir}/${file.name}` ] = path.relative( '/', file.path );
					return manifest;
				}, seed );
			},
		} ),
		new MiniCSSExtractPlugin( {
			filename: 'css/styles.[chunkhash].css',
			chunkFilename: 'css/styles.css',
		} ),
		new CompressionPlugin( {
			filename: '[path].[base].gz[query]',
			algorithm: 'gzip',
			test: /\\.(js|css)$/,
			threshold: 10240,
			minRatio: 0.8,
		} ),
		new CopyWebpackPlugin( {
			patterns: [ {
				from: 'public',
				to: helpers.root( 'dist' ),
			},
			{
				from: 'src/pattern_library/css',
				to: helpers.root( 'dist' ) + '/pattern_library',
			} ],
		} ),
	],
} );

if ( process.env.npm_config_report ) {
	const BundleAnalyzerPlugin = require( 'webpack-bundle-analyzer' ).BundleAnalyzerPlugin;
	webpackConfig.plugins.push( new BundleAnalyzerPlugin() );
}

export default webpackConfig;
