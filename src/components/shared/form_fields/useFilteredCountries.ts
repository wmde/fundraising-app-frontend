import { Country } from '@src/view_models/Country';
import { computed, ComputedRef, ref, Ref, watch } from 'vue';

type ReturnType = { filteredCountries: ComputedRef<Array<Country>>, groupSeparatorIndex: Ref<Number> };

function getGroupSeparatorIndex( countriesList: Array<Country> ): Number {
	if ( countriesList.length === 0 ) {
		return -1;
	}

	if ( countriesList[ 0 ].group !== '' ) {
		return -1;
	}

	return countriesList.findIndex( ( countryOption: Country ) => countryOption.group !== '' );
}

export function useFilteredCountries( countries: Array<Country>, inputCountry: Ref<string> ): ReturnType {
	const filteredCountries = computed<Array<Country>>( () => {
		const countryList = countries.filter( ( countryOption: Country ) => {
			return countryOption.countryFullName
				.toString()
				.toLowerCase()
				.indexOf( inputCountry.value.trim().toLowerCase() ) >= 0;
		} );

		return countryList.length > 0 ? countryList : countries;
	} );

	const groupSeparatorIndex = ref( getGroupSeparatorIndex( filteredCountries.value ) );
	watch( filteredCountries, ( newCountries: Array<Country> ) => {
		groupSeparatorIndex.value = getGroupSeparatorIndex( newCountries );
	} );

	return {
		filteredCountries,
		groupSeparatorIndex,
	};
}
