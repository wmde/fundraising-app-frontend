<template>
	<h3>{{ $t('donation_summary_contact_data_header') }}</h3>
	<p>
		<template v-if="name"><strong>{{ name }}</strong><br/></template>
		<template v-if="cleanedStreetAddress">{{ cleanedStreetAddress }}<br/></template>
		<template v-if="postcodeCity">{{ postcodeCity }}<br/></template>
		<template v-if="showCountry">{{ country }}<br/></template>
		<template v-if="email">{{ email }}<br/></template>
	</p>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { clearStreetAndBuildingNumberSeparator } from '@src/util/street_and_building_number_tools';
import type { Country } from '@src/view_models/Country';
import type { Salutation } from '@src/view_models/Salutation';
import type { Address } from '@src/view_models/Address';
import { useI18n } from 'vue-i18n';

interface Props {
	address: Address;
	countries: Array<Country>;
	salutations: Array<Salutation>;
}
const props = defineProps<Props>();

const { t } = useI18n();

/*
Future feature:
 1. Company name with contact person
 2. AddressType = 'email' without requiring FullName
	For this, we need to remove the second arg of the `else if`,
	because the FullName/ name field should be empty
*/

const name = computed( () => {
	if ( props.address.addressType === 'firma' ) {
		return props.address.companyName || '';
	} else if ( props.address.addressType === 'person' || props.address.addressType === 'email' ) {

		if ( !props.address.firstName?.trim() || !props.address.lastName?.trim() ) {
			return '';
		}

		const nameParts: string[] = [];

		const salutationObject = props.salutations.find( s => s.value === props.address.salutation );
		const salutation = salutationObject?.display?.trim() || '';
		const title = props.address.title?.trim() || '';

		if ( title || salutation ) {
			const key = title
				? 'address_salutation_academic_title'
				: 'address_salutation_no_academic_title';

			const renderedSalutationOrTitle = t( key, { salutation, title } );
			if ( renderedSalutationOrTitle.trim() ) {
				nameParts.push( renderedSalutationOrTitle.trim() );
			}
		}

		nameParts.push( props.address.firstName, props.address.lastName );

		return nameParts.join( ' ' );
	}
	return '';
} );

const cleanedStreetAddress = computed( () =>
	clearStreetAndBuildingNumberSeparator( props.address.street || '' )
);

const postcodeCity = computed( () =>
	props.address.postcode && props.address.city
		? `${props.address.postcode} ${props.address.city}`
		: ''
);

const country = computed( () => {
	const countryObject = props.countries.find(
		( c ) =>
			c.countryCode === props.address.country
	);
	return countryObject ? countryObject.countryFullName : '';
} );

const showCountry = computed( () => {
	return Boolean( postcodeCity.value && country.value );
} );

const email = computed( () => props.address.email || '' );
</script>
