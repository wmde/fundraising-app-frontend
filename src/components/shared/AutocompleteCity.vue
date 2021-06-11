<template>
	<b-autocomplete
		class="is-form-input"
		field="cityName"
		:placeholder="$t( placeholder, { example: $t( examplePlaceholder ) } )"
		v-model="city.value"
		name="city"
		id="city"
		:open-on-focus="true"
		:data="cities"
		@input="onInput"
		@select="onSelect">
		<template slot-scope="props">
			<strong>{{ postcode }}</strong> {{ props.option }}
		</template>
	</b-autocomplete>
</template>

<script lang="ts">
import Vue from 'vue';
import { onMounted, ref, watch, computed, inject } from '@vue/composition-api';
import { CityAutocompleteResource, NullCityAutocompleteResource } from '@/CityAutocompleteResource';
import { trackEvent } from '@/tracking';
import { InputField } from '@/view_models/Address';

const postcodePattern = /^[0-9]{5}$/;

export default Vue.extend( {
	name: 'AutocompleteCity',
	props: {
		examplePlaceholder: String,
		city: Object as () => InputField,
		showError: Boolean,
		postcode: String,
	},
	setup( props, { emit } ) {
		const cityAutocompleteResource = inject<CityAutocompleteResource>( 'cityAutocompleteResource', NullCityAutocompleteResource );

		let currentPostcode = '';
		const cities = ref<Array<string>>( [] );

		const getCitiesForPostcode = ( postcode: string ) => {
			if ( postcode === currentPostcode ) {
				return;
			}
			currentPostcode = postcode;

			if ( !postcodePattern.test( postcode ) ) {
				cities.value = [];
				return;
			}

			cityAutocompleteResource.getCitiesInPostcode( postcode ).then(
				( newCities: Array<string> ) => {
					if ( newCities.length === 0 ) {
						trackEvent( 'City Autocomplete No Results for Postcode', postcode );
					}
					cities.value = newCities;
				}
			);
		};

		const onInput = () => {
			emit( 'field-changed' );
		};

		const onSelect = ( option: string ) => {
			trackEvent( 'City Autocomplete Result Selected', option );
		};

		onMounted( () => {
			getCitiesForPostcode( props.postcode as string );
		} );

		watch( (): string => props.postcode as string, ( value: string ) => {
			getCitiesForPostcode( value );
		} );

		const placeholder = computed( () => {
			if ( cities.value.length > 0 ) {
				return 'form_autocomplete_prompt';
			}
			return 'form_for_example';
		} );

		return {
			cities,
			onInput,
			onSelect,
			placeholder,
		};
	},
} );
</script>
