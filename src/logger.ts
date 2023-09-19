import { Notifier } from '@airbrake/browser';

const LOGGER_ERRBIT: string = 'errbit';
const LOGGER_CONSOLE: string = 'console';

interface Logger {
	notify( error: object ): void
}

class ErrbitLogger implements Logger {
	notifier: Notifier;

	constructor( host: string, projectKey: string ) {
		this.notifier = new Notifier( {
			host: host,
			projectId: 1,
			projectKey: projectKey,
			remoteConfig: false,
		} );
	}

	notify( error: object ) {
		this.notifier.notify( error );
	}
}

class SilentLogger implements Logger {
	notify( error: object ) {} /* eslint-disable-line @typescript-eslint/no-unused-vars */
}

class ConsoleLogger implements Logger {
	notify( error: object ) {
		// eslint-disable-next-line
		console.log( error );
	}
}

/**
 * Factory function to create a logger based on the VUE_APP_LOGGER environment variable.
 * The variable can be set to 'errbit' or 'console'.
 *
 * When using Webpack >=5, the variable needs to be defined in webpack configuration
 * using the DefinePlugin ('process.env.VUE_APP_LOGGER': JSON.stringify( 'errbit' ))
 * or the EnvironmentPlugin ({'VUE_APP_LOGGER': 'errbit'}).
 */
export default function createLogger(): Logger {
	switch ( process.env.VUE_APP_LOGGER ) {
		case LOGGER_CONSOLE:
			return new ConsoleLogger();
		case LOGGER_ERRBIT:
			return new ErrbitLogger(
				process.env.VUE_APP_ERRBIT_HOST || '',
				process.env.VUE_APP_ERRBIT_PROJECT_KEY || ''
			);
		default:
			return new SilentLogger();
	}
}
