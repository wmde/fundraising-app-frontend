<template>
	<h3>{{ $t('form_summary_contact_details_header') }}</h3>
	<p>
		<template v-if="name"><strong>{{ name }}</strong><br/></template>
		<template v-if="companyName"><strong>{{ companyName }}</strong><br/></template>
		<template v-if="cleanedStreetAddress">{{ cleanedStreetAddress }}<br/></template>
		<template v-if="postcodeCity">{{ postcodeCity }}<br/></template>
		<template v-if="showCountry">{{ country }}<br/></template>
		<template v-if="email">{{ email }}<br/></template>
	</p>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Address } from '@src/view_models/Address';
import type { Country } from '@src/view_models/Country';
import type { Salutation } from '@src/view_models/Salutation';
import { clearStreetAndBuildingNumberSeparator } from '@src/util/street_and_building_number_tools';
import { useI18n } from 'vue-i18n';

interface Props {
	address: Address;
	countries: Array<Country>;
	salutations: Array<Salutation>;
}
const props = defineProps<Props>();
const { t } = useI18n();

const companyName = computed<string>( () => {
	if ( [ 'firma', 'company_with_contact' ].includes( props.address.addressType ) ) {
		return props.address.companyName || '';
	}
	return '';
} );

const name = computed( () => {
	if ( [ 'person', 'email', 'company_with_contact' ].includes( props.address.addressType ) ) {

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
