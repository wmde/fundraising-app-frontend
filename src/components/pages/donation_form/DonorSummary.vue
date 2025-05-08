<template>
	<div class="donor-summary" v-if="hasData">
		<h4>{{ $t('donation_summary_contact_data_header') }}</h4>
		<strong v-if="name">{{ name }}<br/></strong>
		<template v-if="cleanedStreetAddress">{{ cleanedStreetAddress }}<br/></template>
		<template v-if="postcodeCity">{{ postcodeCity }}<br/></template>
		<template v-if="country">{{ country }}<br/></template>
		<template v-if="email">{{ email }}<br/></template>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { clearStreetAndBuildingNumberSeparator } from '@src/util/street_and_building_number_tools';
import type { Country } from '@src/view_models/Country';
import type { Salutation } from '@src/view_models/Salutation';
import type { Address } from '@src/view_models/Address';

interface Props {
	address: Address;
	countries: Array<Country>;
	salutations: Array<Salutation>;
}
const props = defineProps<Props>();

const name = computed( () => {
	if ( props.address.companyName ) {
		return props.address.companyName;
	}

	const nameParts: string[] = [];
	if ( props.address.salutation ) {
		const match = props.salutations.find(
			( s ) => s.value === props.address.salutation
		);
		if ( match ) {
			nameParts.push( match.display );
		}
	}

	if ( props.address.title ) {
		nameParts.push( props.address.title );
	}

	if ( props.address.firstName ) {
		nameParts.push( props.address.firstName );
	}
	if ( props.address.lastName ) {
		nameParts.push( props.address.lastName );
	}

	return nameParts.join( ' ' );
} );

const cleanedStreetAddress = computed( () =>
	clearStreetAndBuildingNumberSeparator( props.address.street || '' )
);

const postcodeCity = computed( () =>
	[ props.address.postcode, props.address.city ]
		.filter( Boolean )
		.join( ' ' )
);

const country = computed( () => {
	const countryObject = props.countries.find(
		( c ) =>
			c.countryCode === props.address.countryCode ||
			c.countryCode === props.address.country
	);
	return countryObject ? countryObject.countryFullName : '';
} );

const email = computed( () => props.address.email || '' );

const hasData = computed( () =>
	Boolean( name.value ) ||
	Boolean( cleanedStreetAddress.value ) ||
	Boolean( postcodeCity.value ) ||
	Boolean( country.value ) ||
	Boolean( email.value )
);
</script>
