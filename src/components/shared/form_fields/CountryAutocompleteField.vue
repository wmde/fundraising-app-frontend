<template>
	<div class="form-field form-field-autocomplete" :class="{ 'is-invalid': showError }">
		<label for="country" class="form-field-label">{{ label }}</label>
		<div class="autocomplete control">
			<TextFormInput
				v-model="countryName"
				input-type="text"
				:placeholder="placeholder"
				:has-error="showError"
				:has-message="false"
				input-id="country"
				name="country"
				@focus="onFocusCountry"
				@blur="onBlur"
			/>
			<transition name="fade">
				<div class="dropdown-menu" v-show="autocompleteIsActive">
					<div class="dropdown-content">
						<template v-for="( country, index ) in filteredCountries">
							<span v-if="groupSeparatorIndex === index" class="dropdown-separator"><hr></span>
							<a class="dropdown-item" role="button" tabindex="0" @click.stop="() => onSelectItem( country.countryFullName )">
								{{ country.countryFullName }}
							</a>
						</template>
					</div>
				</div>
			</transition>
		</div>
		<span v-if="showError" class="help is-danger">{{ errorMessage }}</span>
		<slot name="message"/>
	</div>
</template>

<script setup lang="ts">

import { onMounted, ref, watch } from 'vue';
import { useCountryInput } from '@src/components/shared/legacy_form_inputs/useCountryInput';
import { useFilteredCountries } from '@src/components/shared/legacy_form_inputs/useFilteredCountries';
import { Country } from '@src/view_models/Country';
import { useAutocompleteEvents } from '@src/components/shared/form_fields/useAutocompleteEvents';
import TextFormInput from '@src/components/shared/form_inputs/TextFormInput.vue';

interface Props {
	modelValue: Country | undefined;
	initialCountryCode: string;
	label: String;
	placeholder: String;
	countries?: Array<Country>;
	showError: boolean;
	errorMessage: String;
}

const props = defineProps<Props>();
const emit = defineEmits( [ 'initialised', 'field-changed', 'update:modelValue' ] );

const wasFocusedBefore = ref<Boolean>( false );
const { country, countryName, initialisedWithValue } = useCountryInput( props.initialCountryCode, props.countries );
const { autocompleteIsActive, onFocus, onBlur, onSelectItem } = useAutocompleteEvents( countryName, emit );
const { filteredCountries, groupSeparatorIndex } = useFilteredCountries( props.countries, countryName );

const isFirstFocusOnDefaultValue = (): boolean => {
	return !wasFocusedBefore.value && !initialisedWithValue;
};

const onFocusCountry = ( event: Event ) => {
	if ( isFirstFocusOnDefaultValue() ) {
		countryName.value = '';
	}
	wasFocusedBefore.value = true;

	onFocus( event );
};

watch( country, ( newCountry: Country|undefined ) => {
	emit( 'update:modelValue', newCountry );
} );

// Emit when mounted because the country value has now been set
onMounted( () => emit( 'initialised', country.value ) );

</script>

<style scoped lang="scss">

</style>
