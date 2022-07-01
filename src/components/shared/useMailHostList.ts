import { ref } from 'vue';
import axios from 'axios';

/**
 * This is a Vue composable that provides a list of popular mail providers.
 *
 * Right now it's used in the Email component to check for typos.
 */
export function useMailHostList() {
	const mailHostList = ref( [] );

	axios.get( '/resources/mail_provider_suggestions.json' )
		.then( ( response ) => {
			mailHostList.value = response.data;
		} )
		.catch( () => {
			// Do nothing - if the request fails, we just don't have (optional) data,
			// but still have the empty array that the code can work with
		} );

	return { mailHostList };
}
