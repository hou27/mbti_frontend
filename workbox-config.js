module.exports = {
	globDirectory: 'public/',
	globPatterns: [
		'**/*.{png,ico,html,json,txt}'
	],
	swDest: 'public/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};