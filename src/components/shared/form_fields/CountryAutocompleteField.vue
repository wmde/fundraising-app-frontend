<template>
	<div class="form-field form-field-autocomplete" :class="{ 'is-invalid': showError }">
		<label :for="inputId" class="form-field-label">{{ label }}</label>
		<div class="form-field-autocomplete-container">
			<TextFormInput
				v-model="countryName"
				input-type="text"
				:placeholder="placeholder"
				:has-error="showError"
				:has-message="false"
				:input-id="inputId"
				name="countrySelector"
				@focus="onFocus"
				@blur="() => onBlur( country )"
			/>
			<input type="hidden" name="country" :value="country?.countryCode">
			<transition name="fade">
				<div class="dropdown-menu" v-show="autocompleteIsActive">
					<div class="dropdown-content">
						<template v-for="( country, index ) in filteredCountries">
							<span v-if="groupSeparatorIndex === index" class="dropdown-separator"><hr></span>
							<a class="dropdown-item" role="button" tabindex="0" @click.stop="() => onSelectItem( country )" @keyup.enter.space="onSelectItem(country)">
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

import { useCountryInput } from '@src/components/shared/form_fields/useCountryInput';
import { useFilteredCountries } from '@src/components/shared/form_fields/useFilteredCountries';
import { Country } from '@src/view_models/Country';
import TextFormInput from '@src/components/shared/form_elements/TextFormInput.vue';
import { useCountryAutocompleteEvents } from '@src/components/shared/form_fields/useCountryAutocompleteEvents';

interface Props {
	modelValue: string;
	inputId: string;
	label: String;
	placeholder: String;
	countries?: Array<Country>;
	showError: boolean;
	errorMessage: String;
	wasRestored: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits( [ 'initialised', 'field-changed', 'update:modelValue' ] );

const { country, countryName } = useCountryInput( props.modelValue, props.countries, emit );
const { autocompleteIsActive, onFocus, onBlur, onSelectItem } = useCountryAutocompleteEvents( countryName, props.wasRestored, emit );
const { filteredCountries, groupSeparatorIndex } = useFilteredCountries( props.countries, countryName );

</script>

<style lang="scss">

</style>
