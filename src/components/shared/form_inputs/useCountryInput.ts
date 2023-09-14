import { ref, Ref, watch } from 'vue';
import { Country } from '@src/view_models/Country';

type ReturnType = { country: Ref<Country|undefined>, countryName: Ref<string>, initialisedWithValue: Boolean };

function getCountryFromCode( countryCode: string, countries: Array<Country> ): Country|undefined {
	return countries.find( ( c: Country ) => c.countryCode === countryCode );
}
function getCountryFromCountryFullName( countryFullName: string, countries: Array<Country> ): Country|undefined {
	return countries.find( ( c: Country ) => c.countryFullName === countryFullName );
}

export function useCountryInput( initialCountryCode: string | undefined, countries: Array<Country> ): ReturnType {
	const country = ref( initialCountryCode ? getCountryFromCode( initialCountryCode, countries ) : countries[ 0 ] );

	const countryName = ref( country.value?.countryFullName ?? '' );
	const initialisedWithValue = initialCountryCode !== undefined && initialCountryCode !== '';

	watch( countryName, ( newCountry: string ) => {
		country.value = getCountryFromCountryFullName( newCountry, countries );
	} );

	return {
		country,
		countryName,
		initialisedWithValue,
	};
}
