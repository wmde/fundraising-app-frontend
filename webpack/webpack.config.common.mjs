'use strict';

import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { VueLoaderPlugin } from 'vue-loader';
import MiniCSSExtractPlugin from 'mini-css-extract-plugin';
import helpers from './helpers.mjs';

const isDev = process.env.NODE_ENV === 'development';

const webpackConfig = {
	entry: {
		'index': './src/pages/donation_form.ts',
		'access_denied': './src/pages/access_denied.ts',
		'address_update_success': './src/pages/address_update_success.ts',
		'comment_list': './src/pages/comment_list.ts',
		'comment_ticker': './src/pages/comment_ticker.ts',
		'contact_form': './src/pages/contact_form.ts',
		'donation_confirmation': './src/pages/donation_confirmation.ts',
		'donation_form': './src/pages/donation_form.ts',
		'error': './src/pages/error.ts',
		'frequent_questions': './src/pages/frequent_questions.ts',
		'funds_usage': './src/pages/funds_usage.ts',
		'membership_application': './src/pages/membership_application.ts',
		'membership_application_confirmation': './src/pages/membership_application_confirmation.ts',
		'page_not_found': './src/pages/page_not_found.ts',
		'static_page': './src/pages/static_page.ts',
		'system_message': './src/pages/system_message.ts',
		'supporters': './src/pages/supporters.ts',
		'update_address': './src/pages/update_address.ts',
		'subscription_confirmation': './src/pages/subscription_confirmation.ts',
		'pattern_library': './src/pattern_library/index.ts',
	},
	output: {
		path: helpers.root( 'dist' ),
		publicPath: '/',
		filename: 'js/[name].js',
		chunkFilename: 'js/[name].js',
	},
	resolve: {
		extensions: [ '.ts', '.js', '.vue' ],
		alias: {
			'@src': helpers.root( 'src' ),
		},
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader',
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				include: [ helpers.root( 'src' ) ],
			},
			{
				test: /\.ts$/,
				use: [ 'babel-loader', { loader: 'ts-loader', options: { appendTsSuffixTo: [ /\.vue$/ ] } } ],
			},
			{
				test: /\.css$/,
				oneOf: [
					{
						resourceQuery: /raw/,
						type: 'asset/source',
					},
					{
						use: [
							{ loader: isDev ? 'style-loader' : MiniCSSExtractPlugin.loader },
							{ loader: 'css-loader', options: { sourceMap: isDev, url: false } },
						],
					},
				],
			},
			{
				test: /\.scss$/,
				use: [
					{ loader: isDev ? 'style-loader' : MiniCSSExtractPlugin.loader },
					{ loader: 'css-loader', options: { sourceMap: isDev, url: false } },
					// Deprecations are silenced because our version of Bulma won't be compatible with Dart Sass 3
					// We will need to address this in the near future
					{ loader: 'sass-loader', options: { sourceMap: isDev, sassOptions: {
						loadPaths: [ helpers.root( '' ) ],
						quietDeps: true,
						silenceDeprecations: [ 'import' ],
					} } },
				],
			},
			{
				test: /\.sass$/,
				use: [
					{ loader: isDev ? 'style-loader' : MiniCSSExtractPlugin.loader },
					{ loader: 'css-loader', options: { sourceMap: isDev, url: false } },
					// Deprecations are silenced because our version of Bulma won't be compatible with Dart Sass 3
					// We will need to address this in the near future
					{ loader: 'sass-loader', options: { sourceMap: isDev, sassOptions: { quietDeps: true, silenceDeprecations: [ 'import' ] } } },
				],
			},
			{
				test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf|ico)$/i,
				type: 'asset/resource',
			},
			{
				test: /\.html$/,
				type: 'asset/source',
			},
			{
				test: /\.md$/,
				use: [ 'html-loader', 'markdown-loader' ],
			},
		],
	},
	optimization: {
		splitChunks: {
			cacheGroups: {
				commons: {
					test: /node_modules/,
					chunks: 'initial',
					name: 'chunk-vendors',
				},
				'styles-compiled': {
					name: 'styles',
					test: module =>
						module.nameForCondition &&
						/\.(scss|vue)$/.test( module.nameForCondition() ) && !/^javascript/.test( module.type ),
					chunks: 'all',
					enforce: true,
				},
			},
		},
	},
	plugins: [
		new VueLoaderPlugin(),
		new ForkTsCheckerWebpackPlugin( {
			typescript: {
				extensions: {
					vue: true,
				},
			},
		} ),
	],
};

export default webpackConfig;
