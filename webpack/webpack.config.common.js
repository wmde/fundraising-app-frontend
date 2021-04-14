'use strict';

const ForkTsCheckerWebpackPlugin = require( 'fork-ts-checker-webpack-plugin' );
const VueLoaderPlugin = require( 'vue-loader/lib/plugin' );
const MiniCSSExtractPlugin = require( 'mini-css-extract-plugin' );
const helpers = require( './helpers' );
const isDev = process.env.NODE_ENV === 'development';

const webpackConfig = {
	entry: {
		'index': './src/pages/donation_form.ts',
		'access_denied': './src/pages/access_denied.ts',
		'address_update_success': './src/pages/address_update_success.ts',
		'comment_list': './src/pages/comment_list.ts',
		'contact_form': './src/pages/contact_form.ts',
		'donation_cancellation_confirmation': './src/pages/donation_cancellation_confirmation.ts',
		'donation_confirmation': './src/pages/donation_confirmation.ts',
		'donation_form': './src/pages/donation_form.ts',
		'error': './src/pages/error.ts',
		'frequent_questions': './src/pages/frequent_questions.ts',
		'funds_usage': './src/pages/funds_usage.ts',
		'membership_application': './src/pages/membership_application.ts',
		'membership_application_cancellation_confirmation': './src/pages/membership_application_cancellation_confirmation.ts',
		'membership_application_confirmation': './src/pages/membership_application_confirmation.ts',
		'page_not_found': './src/pages/page_not_found.ts',
		'privacy_protection': './src/pages/privacy_protection.ts',
		'static_page': './src/pages/static_page.ts',
		'system_message': './src/pages/system_message.ts',
		'supporters': './src/pages/supporters.ts',
		'update_address': './src/pages/update_address.ts',

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
			'vue$': isDev ? 'vue/dist/vue.runtime.js' : 'vue/dist/vue.runtime.min.js',
			'@': helpers.root( 'src' ),
		},
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader',
				include: [ helpers.root( 'src' ) ],
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				include: [ helpers.root( 'src' ) ],
			},
			{
				test: /\.tsx?$/,
				use: [
					{ loader: 'babel-loader' },
					{
						loader: 'ts-loader',
						options: {
							appendTsSuffixTo: [ /\.vue$/ ],
							// Type check happens in ForkTsCheckerWebpackPlugin
							transpileOnly: true,
						},
					},
				],
				exclude: /node_modules/,
			},
			{
				test: /\.css$/,
				use: [
					{ loader: isDev ? 'vue-style-loader' : MiniCSSExtractPlugin.loader },
					{ loader: 'css-loader', options: { sourceMap: isDev, url: false } },
				],
			},
			{
				test: /\.scss$/,
				use: [
					{ loader: isDev ? 'vue-style-loader' : MiniCSSExtractPlugin.loader },
					{ loader: 'css-loader', options: { sourceMap: isDev, url: false } },
					{ loader: 'sass-loader', options: { sourceMap: isDev } },
				],
			},
			{
				test: /\.sass$/,
				use: [
					{ loader: isDev ? 'vue-style-loader' : MiniCSSExtractPlugin.loader },
					{ loader: 'css-loader', options: { sourceMap: isDev, url: false } },
					{ loader: 'sass-loader', options: { sourceMap: isDev } },
				],
			},
			{
				test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf|ico)$/i,
				use: [
					{
						loader: 'file-loader',
					},
				],
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
						/\.(s?css|vue)$/.test( module.nameForCondition() ) && !/^javascript/.test( module.type ),
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

module.exports = webpackConfig;
