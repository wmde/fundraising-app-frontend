import { Ref, ref } from 'vue';
import { StreetAutocompleteResource } from '@src/api/StreetAutocompleteResource';

type ReturnType = { streets: Ref<Array<string>>, fetchStreetsForPostcode: ( postcode: string ) => void }
const postcodePattern = /^[0-9]{5}$/;

export function useStreetsResource( resource: StreetAutocompleteResource ): ReturnType {
	const streets = ref<Array<string>>( [] );
	let currentPostcode = '';

	const fetchStreetsForPostcode = ( postcode: string ) => {
		if ( postcode === currentPostcode ) {
			return;
		}
		currentPostcode = postcode;

		if ( !postcodePattern.test( postcode ) ) {
			streets.value = [];
			return;
		}

		resource.getStreetsInPostcode( postcode ).then(
			( newStreets: Array<string> ) => {
				streets.value = newStreets;
			}
		);
	};

	return {
		streets,
		fetchStreetsForPostcode,
	};
}
