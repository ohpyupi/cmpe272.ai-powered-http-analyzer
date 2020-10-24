const path = require('path');
const webpack = require('webpack');

module.exports = {
	entry: {
		app: './app/app.js',
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, './dist'),
	},
	node: {
		fs: 'empty',
		net: 'empty',
		tls: 'empty',
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader',
				options: {
					presets: ['@babel/preset-env', '@babel/preset-react'],
				}
			},
			{
				test: /\.html$/,
				use: [
					'html-loader',
				],
			},
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader'
				],
			},
			{
				test: /\.(sass|scss)$/,
				use: [
					'style-loader',
					'css-loader',
					'sass-loader'
				],
			},
			{
				test: /\.(eot|svg|gif|png|jpg|ttf|woff(2)?)(\?v=\d+\.\d+\.\d+)?/,
				use: [
					'url-loader'
				],
			},
		],
	},
};
