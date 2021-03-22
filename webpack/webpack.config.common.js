'use strict';

const VueLoaderPlugin      = require('vue-loader/lib/plugin');
const HtmlPlugin           = require('html-webpack-plugin');
//const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const helpers              = require('./helpers');
const isDev                = process.env.NODE_ENV === 'development';

const webpackConfig = {
    entry: {
        main: helpers.root('src', 'pages', 'error.ts'),
    },
    resolve: {
        extensions: [ '.ts', '.js', '.vue' ],
        alias: {
            'vue$': isDev ? 'vue/dist/vue.runtime.js' : 'vue/dist/vue.runtime.min.js',
            '@': helpers.root('src')
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                include: [ helpers.root('src') ]
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [ helpers.root('src') ]
            },
			 {
        		test: /\.tsx?$/,
				 use: [
					 { 
						 loader: 'ts-loader',
						 options: {
					 		appendTsSuffixTo: [/\.vue$/],
				 			}
					 }
				 ],
        		exclude: /node_modules/,
		      },
            {
                test: /\.css$/,
                use: [
                    { loader: 'css-loader', options: { sourceMap: isDev } },
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    { loader: 'css-loader', options: { sourceMap: isDev } },
                    { loader: 'sass-loader', options: { sourceMap: isDev } }
                ]
            },
            {
                test: /\.sass$/,
                use: [
                    { loader: 'css-loader', options: { sourceMap: isDev } },
                    { loader: 'sass-loader', options: { sourceMap: isDev } }
                ]
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
    ]
};

module.exports = webpackConfig;
