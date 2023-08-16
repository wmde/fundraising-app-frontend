import { Ref, ref } from 'vue';
import { CityAutocompleteResource } from '@/CityAutocompleteResource';

type ReturnType = { cities: Ref<Array<string>>, fetchCitiesForPostcode: ( postcode: string ) => void }
const postcodePattern = /^[0-9]{5}$/;

export function useCitiesResource( resource: CityAutocompleteResource ): ReturnType {
	const cities = ref<Array<string>>( [] );
	let currentPostcode = '';

	const fetchCitiesForPostcode = ( postcode: string ) => {
		if ( postcode === currentPostcode ) {
			return;
		}
		currentPostcode = postcode;

		if ( !postcodePattern.test( postcode ) ) {
			cities.value = [];
			return;
		}

		resource.getCitiesInPostcode( postcode ).then(
			( newCities: Array<string> ) => {
				cities.value = newCities;
			}
		);
	};

	return {
		cities,
		fetchCitiesForPostcode,
	};
}
