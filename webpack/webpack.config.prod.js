'use strict';

const webpack = require( 'webpack' );
const { merge } = require( 'webpack-merge' );
const MiniCSSExtractPlugin = require( 'mini-css-extract-plugin' );
const CssMinimizerPlugin = require( 'css-minimizer-webpack-plugin' );
const CopyWebpackPlugin = require( 'copy-webpack-plugin' );
const TerserPlugin = require( 'terser-webpack-plugin' );
const CompressionPlugin = require( 'compression-webpack-plugin' );
const helpers = require( './helpers' );
const commonConfig = require( './webpack.config.common' );
const environment = require( './env/prod.env' );

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
	plugins: [
		new webpack.EnvironmentPlugin( environment ),
		new MiniCSSExtractPlugin( {
			filename: 'css/styles.css',
			chunkFilename: 'css/styles.css',
		} ),
		new CompressionPlugin( {
			filename: '[path][base].gz[query]',
			algorithm: 'gzip',
			test: /\\.(js|css)$/,
			threshold: 10240,
			minRatio: 0.8,
		} ),
		new CopyWebpackPlugin( {
			patterns: [ {
				from: 'public',
				to: helpers.root( 'dist' ),
			} ],
		} ),
	],
} );

if ( process.env.npm_config_report ) {
	const BundleAnalyzerPlugin = require( 'webpack-bundle-analyzer' ).BundleAnalyzerPlugin;
	webpackConfig.plugins.push( new BundleAnalyzerPlugin() );
}

module.exports = webpackConfig;
