<template>
	<div class="autocomplete control">
		<TextInput
			v-model="countryName"
			:placeholder="placeholder"
			:has-error="hasError"
			input-id="country"
			name="country"
			@focus="onFocus"
			@blur="onBlur"
		/>
		<transition name="fade">
			<div class="dropdown-menu" v-show="autocompleteIsActive">
				<div class="dropdown-content">
					<template v-for="( country, index ) in filteredCountries">
						<span v-if="groupSeparatorIndex === index" class="dropdown-separator"><hr></span>
						<a class="dropdown-item" role="button" tabindex="0" @click.stop="() => onSelectCountry( country )">
							{{ country.countryFullName }}
						</a>
					</template>
				</div>
			</div>
		</transition>
	</div>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, ref, watch } from 'vue';
import TextInput from '@src/components/shared/form_inputs/TextInput.vue';
import { Country } from '@src/view_models/Country';
import { useFilteredCountries } from '@src/components/shared/form_inputs/useFilteredCountries';
import { useCountryInput } from '@src/components/shared/form_inputs/useCountryInput';

export default defineComponent( {
	name: 'AutocompleteCountry',
	components: { TextInput },
	props: {
		modelValue: Object as () => Country,
		initialCountryCode: String,
		placeholder: String,
		countries: {
			type: Array as () => Array<Country>,
			default: [],
		},
		hasError: Boolean,
	},
	setup( props, { emit } ) {
		const wasFocusedBefore = ref<Boolean>( false );
		const autocompleteIsActive = ref<Boolean>( false );
		const { country, countryName, initialisedWithValue } = useCountryInput( props.initialCountryCode, props.countries );
		const { filteredCountries, groupSeparatorIndex } = useFilteredCountries( props.countries, countryName );

		const isFirstFocusOnDefaultValue = (): boolean => {
			return !wasFocusedBefore.value && !initialisedWithValue;
		};

		const onFocus = ( event: Event ) => {
			if ( isFirstFocusOnDefaultValue() ) {
				countryName.value = '';
			}
			wasFocusedBefore.value = true;

			( event.target as HTMLInputElement ).select();
			autocompleteIsActive.value = true;
		};

		const onBlur = () => {
			setTimeout( () => {
				autocompleteIsActive.value = false;
			}, 200 );
			emit( 'field-changed' );
		};

		const onSelectCountry = async ( newCountry: Country ) => {
			countryName.value = newCountry.countryFullName;
			await nextTick();
			emit( 'field-changed' );
		};

		watch( country, ( newCountry: Country|undefined ) => {
			emit( 'update:modelValue', newCountry );
		} );

		// Emit when mounted because the country value has now been set
		onMounted( () => emit( 'initialised', country.value ) );

		return {
			autocompleteIsActive,
			countryName,
			filteredCountries,
			groupSeparatorIndex,
			onFocus,
			onBlur,
			onSelectCountry,
		};
	},
} );
</script>
