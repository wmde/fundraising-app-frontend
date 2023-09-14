import { App, Component, createApp } from 'vue';
import { createLocalisation } from '@src/locales';
import createLogger from '@src/logger';

type Data = Record<string, unknown>;
type Messages = Record<string, string>;

export function createVueApp( rootComponent: Component, messages: Messages, rootProps?: Data ): App {
	const i18n = createLocalisation( messages );
	const app = createApp( rootComponent, {
		...rootProps,
	} );
	app.use( i18n );

	app.config.errorHandler = ( err, vm, info ) => {
		createLogger().notify( {
			error: err,
			params: { info: info },
		} );
	};

	return app;
}
