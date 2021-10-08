<template>
	<b-autocomplete
		ref="autocomplete"
		class="is-form-input"
		field="cityName"
		:placeholder="$t( placeholder, { example: $t( examplePlaceholder ) } )"
		v-model="city.value"
		autocomplete="off"
		name="city"
		id="city"
		:open-on-focus="true"
		:data="cities"
		@input="onInput"
		@blur="onBlur">
		<template slot-scope="props">
			<strong>{{ postcode }}</strong> {{ props.option }}
		</template>
	</b-autocomplete>
</template>

<script lang="ts">
import Vue from 'vue';
import { onMounted, ref, watch, computed, inject } from '@vue/composition-api';
import { CityAutocompleteResource, NullCityAutocompleteResource } from '@/CityAutocompleteResource';
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
		const autocomplete = ref<any>( null );

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
					cities.value = newCities;
				}
			);
		};

		const onInput = () => {
			emit( 'field-changed' );
		};

		// This is for hiding the cities suggestions after the user
		// performs an autofill using their browser. clickedOutside()
		// is an undocumented method on the Buefy Autocomplete component
		// and we send it a fake event because then it hides the dropdown
		// Issue: https://phabricator.wikimedia.org/T285921
		// Merge Request: https://gitlab.com/fun-tech/fundraising-app-frontend/-/merge_requests/96
		const onBlur = () => {
			setTimeout( () => {
				autocomplete.value?.clickedOutside( new Event( 'fake event' ) );
			}, 200 );
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
			autocomplete,
			onInput,
			onBlur,
			placeholder,
		};
	},
} );
</script>
