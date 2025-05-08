<template>
	<div class="donor-summary">
		<h3 class="summary-title">{{ $t('donation_summary_contact_data_header') }}</h3>
		<strong v-if="name">{{ name }}<br/></strong>
		<template v-if="cleanedStreetAddress">{{ cleanedStreetAddress }}<br/></template>
		<template v-if="postcodeCity">{{ postcodeCity }}<br/></template>
		<template v-if="showCountry">{{ country }}<br/></template>
		<template v-if="email">{{ email }}<br/></template>
	</div>
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

const name = computed( () => {
	if ( props.address.companyName ) {
		return props.address.companyName;
	}

	if ( !props.address.firstName?.trim() || !props.address.lastName?.trim() ) {
		return '';
	}

	const nameParts: string[] = [];

	if ( props.address.salutation || props.address.title ) {
		const localisationKey = props.address.title
			? 'address_salutation_academic_title'
			: 'address_salutation_no_academic_title';

		const renderedSalutationOrTitle = t( localisationKey, {
			salutation: props.address.salutation || '',
			title: props.address.title || '',
		} );

		if ( renderedSalutationOrTitle.trim() ) {
			nameParts.push( renderedSalutationOrTitle.trim() );
		}
	}

	nameParts.push( props.address.firstName, props.address.lastName );

	return nameParts.join( ' ' );
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
