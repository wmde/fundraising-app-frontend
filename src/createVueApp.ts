import { App, Component, createApp } from 'vue';
import { createLocalisation } from '@src/util/createLocalisation';
import createLogger from '@src/util/logger';
import { createFeatureToggle } from '@src/util/createFeatureToggle';
import { FeatureFetcher } from '@src/util/FeatureFetcher';

type Data = Record<string, unknown>;
type Messages = Record<string, string>;

export function createVueApp(
	rootComponent: Component,
	messages: Messages,
	featureFetcher: FeatureFetcher,
	rootProps?: Data
): App {
	const i18n = createLocalisation( messages );
	const app = createApp( rootComponent, {
		...rootProps,
	} );
	app.use( i18n );

	if ( process.env.NODE_ENV === 'production' ) {
		app.config.errorHandler = ( err, vm, info ) => {
			createLogger().notify( {
				error: err,
				params: { info: info },
			} );
		};
	}

	app.component( 'FeatureToggle', createFeatureToggle( featureFetcher.getFeatures() ) );

	return app;
}
