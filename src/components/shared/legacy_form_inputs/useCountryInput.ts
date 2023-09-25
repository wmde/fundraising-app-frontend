import { ref, Ref, watch } from 'vue';
import { Country } from '@src/view_models/Country';

type ReturnType = { country: Ref<Country|undefined>, countryName: Ref<string> };

function getCountryFromCode( countryCode: string, countries: Array<Country> ): Country|undefined {
	return countries.find( ( c: Country ) => c.countryCode === countryCode );
}
function getCountryFromCountryFullName( countryFullName: string, countries: Array<Country> ): Country|undefined {
	return countries.find( ( c: Country ) => c.countryFullName === countryFullName );
}

export function useCountryInput( initialCountryCode: string, countries: Array<Country>, emit: ( event: string, payload: string ) => void ): ReturnType {
	const country = ref<Country>( getCountryFromCode( initialCountryCode, countries ) );
	const countryName = ref<string>( country.value?.countryFullName ?? '' );

	watch( countryName, ( newCountry: string ) => {
		country.value = getCountryFromCountryFullName( newCountry, countries );
		emit( 'update:modelValue', country.value ? country.value.countryCode : '' );
	} );

	return {
		country,
		countryName,
	};
}
