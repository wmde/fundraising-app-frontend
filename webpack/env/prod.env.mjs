export default {
	NODE_ENV: 'production',
	VUE_APP_LOGGER: 'errbit',
	VUE_APP_ERRBIT_HOST: process.env.VUE_APP_ERRBIT_HOST || 'https://logging.wikimedia.de',
	// should be set in the CI/CD pipeline or when running locally
	// e.g. "VUE_APP_ERRBIT_PROJECT_KEY=1234567890abcdef npm run build"
	VUE_APP_ERRBIT_PROJECT_KEY: process.env.VUE_APP_ERRBIT_PROJECT_KEY || '',
};
