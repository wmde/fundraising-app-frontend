import { inject, InjectionKey } from 'vue';

export function injectStrict<T>( key: InjectionKey<T> ): T {
	const resolved = inject( key );
	if ( !resolved ) {
		throw new Error( `Could not resolve ${key.description}` );
	}

	return resolved;
}
