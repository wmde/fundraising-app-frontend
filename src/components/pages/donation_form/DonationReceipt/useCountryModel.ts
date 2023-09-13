import { ref, Ref, watch } from 'vue';
import { Country } from '@src/view_models/Country';
import { AddressFormData } from '@src/view_models/Address';

type ReturnType = {
	country: Ref<Country>,
	initialiseCountry: ( newCountry: ( Country | undefined ) ) => void,
};

export function useCountryModel( formData: AddressFormData, defaultPostcodeValidation: string, emit: ( event: string, payload: string ) => void ): ReturnType {
	const country = ref<Country>( undefined );

	const setCountry = ( newCountry: Country | undefined ): void => {
		if ( newCountry ) {
			formData.country.value = newCountry.countryCode;
			formData.postcode.pattern = newCountry.postCodeValidation;
		} else {
			formData.country.value = '';
			formData.postcode.pattern = defaultPostcodeValidation;
		}
	};

	const initialiseCountry = ( newCountry: Country | undefined ): void => {
		setCountry( newCountry );
		emit( 'field-changed', 'country' );
	};

	watch( country, ( newCountry: Country | undefined ) => {
		setCountry( newCountry );
		emit( 'field-changed', 'country' );
		emit( 'field-changed', 'postcode' );
	} );

	return {
		country,
		initialiseCountry,
	};
}
