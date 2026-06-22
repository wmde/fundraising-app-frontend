module.exports = {
	'presets': [
		[
			'@babel/preset-env',
			{
				'modules': 'auto',
				'corejs': {
					'version': 3,
					'proposals': true,
				},
			},
		],
	],
	'plugins': [
		'@babel/plugin-transform-runtime',
	],
};
