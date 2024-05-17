<template>
	<div class="form-field form-field-autocomplete" :class="{ 'is-invalid': showError }">
		<label for="city" class="form-field-label">{{ label }}</label>
		<div class="form-field-autocomplete-container">
			<TextFormInput
				v-model="city"
				input-type="text"
				name="city"
				:placeholder="$t( placeholder, { example: $t( examplePlaceholder ) } )"
				:has-error="showError"
				:has-message="false"
				input-id="city"
				@focus="onFocus"
				@blur="onBlur"
			/>
			<transition name="fade">
				<div class="dropdown-menu" v-show="autocompleteIsActive && cities.length > 0">
					<div class="dropdown-content">
						<template v-for="city in cities">
							<a class="dropdown-item" role="button" tabindex="0" @click.stop="onSelectItem( city )" @keyup.enter.space="onSelectItem( city )">
								<strong>{{ postcode }}</strong> {{ city }}
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
import { computed, inject, onMounted, ref, watch } from 'vue';
import { useCitiesResource } from '@src/components/shared/form_fields/useCitiesResource';
import { CityAutocompleteResource, NullCityAutocompleteResource } from '@src/util/CityAutocompleteResource';
import { useCityAutocompleteEvents } from '@src/components/shared/form_fields/useCityAutocompleteEvents';
import TextFormInput from '@src/components/shared/form_elements/TextFormInput.vue';

interface Props {
	modelValue: string;
	label: String;
	examplePlaceholder: string;
	showError: boolean;
	errorMessage: String;
	postcode: string;
}

const props = defineProps<Props>();
const emit = defineEmits( [ 'field-changed', 'update:modelValue' ] );

const city = ref<string>( props.modelValue );
const { autocompleteIsActive, onFocus, onBlur, onSelectItem } = useCityAutocompleteEvents( city, emit );
const { cities, fetchCitiesForPostcode } = useCitiesResource( inject<CityAutocompleteResource>( 'cityAutocompleteResource', NullCityAutocompleteResource ) );

const placeholder = computed( () => {
	if ( cities.value.length > 0 ) {
		return 'form_autocomplete_prompt';
	}
	return 'form_for_example';
} );

onMounted( () => {
	fetchCitiesForPostcode( props.postcode as string );
} );

watch( (): string => props.postcode as string, ( value: string ) => {
	fetchCitiesForPostcode( value );
} );

watch( city, ( newCity: string ) => {
	emit( 'update:modelValue', newCity );
} );

</script>

<style lang="scss">

</style>
