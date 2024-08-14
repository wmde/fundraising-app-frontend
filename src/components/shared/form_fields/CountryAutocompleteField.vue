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
				@keydown="onKeydown"
				@keydown.up.prevent="onKeyArrows('up')"
				@keydown.down.prevent="onKeyArrows('down')"
				@keydown.tab="onKeySubmit"
				@keydown.enter="onKeySubmit"
				:aria-describedby="ariaDescribedby"
				aria-autocomplete="list"
			/>
			<span class="is-sr-only" :id="`${inputId}-selected`" aria-live="assertive">
				{{ activeCountryName }}
			</span>
			<input type="hidden" name="country" :value="country?.countryCode">
			<transition name="fade">
				<div class="dropdown-menu" v-show="autocompleteIsActive">
					<div class="dropdown-content" ref="scrollElement" tabindex="-1">
						<template v-for="( country, index ) in filteredCountries">
							<span v-if="groupSeparatorIndex === index" class="dropdown-separator"><hr></span>
							<a
								class="dropdown-item"
								:class="{ 'is-active-item': country.countryCode === activeCountry }"
								role="button"
								tabindex="-1"
								@click.stop="() => onSelectItem( country )"
								@keyup.enter.space="onSelectItem(country)"
							>
								{{ country.countryFullName }}
							</a>
						</template>
					</div>
				</div>
			</transition>
		</div>
		<span v-if="showError" class="help is-danger" :id="`${inputId}-error`">{{ errorMessage }}</span>
		<slot name="message"/>
	</div>
</template>

<script setup lang="ts">

import { useCountryInput } from '@src/components/shared/form_fields/useCountryInput';
import { useFilteredCountries } from '@src/components/shared/form_fields/useFilteredCountries';
import { Country } from '@src/view_models/Country';
import TextFormInput from '@src/components/shared/form_elements/TextFormInput.vue';
import { computed, nextTick, ref } from 'vue';
import { updateAutocompleteScrollPosition } from '@src/components/shared/form_fields/updateAutocompleteScrollPosition';
import { useAriaDescribedby } from '@src/components/shared/form_fields/useAriaDescribedby';

enum InteractionState {
	Typing,
	Selecting
}

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
const { filteredCountries, groupSeparatorIndex } = useFilteredCountries( props.countries, countryName );
const interactionState = ref<InteractionState>( InteractionState.Typing );
const activeCountry = ref<string>();
const activeCountryName = computed<string>( () => {
	return filteredCountries.value.find( x => x.countryCode === activeCountry.value )?.countryFullName;
} );
const scrollElement = ref<HTMLElement>();
const wasFocusedBefore = ref<Boolean>( false );
const autocompleteIsActive = ref<Boolean>( false );
const ariaDescribedby = useAriaDescribedby(
	computed<string>( () => activeCountry.value ? `${props.inputId}-selected` : '' ),
	`${props.inputId}-error`,
	computed<boolean>( () => props.showError )
);

const isFirstFocusOnDefaultValue = (): boolean => {
	return !wasFocusedBefore.value && !props.wasRestored;
};

const onFocus = ( event: Event ) => {
	if ( isFirstFocusOnDefaultValue() ) {
		countryName.value = '';
	}
	wasFocusedBefore.value = true;

	autocompleteIsActive.value = true;
	( event.target as HTMLInputElement ).select();
};

const onKeydown = ( event: KeyboardEvent ) => {
	if ( [ 'ArrowUp', 'ArrowDown', 'Tab', 'Enter' ].includes( event.key ) ) {
		return true;
	}

	interactionState.value = InteractionState.Typing;
	activeCountry.value = undefined;
};

const onKeyArrows = async ( direction: 'up'|'down' ) => {
	interactionState.value = InteractionState.Selecting;

	if ( activeCountry.value === undefined ) {
		activeCountry.value = filteredCountries.value[ 0 ].countryCode;
		return;
	}

	let index = filteredCountries.value.findIndex( x => x.countryCode === activeCountry.value );

	if ( direction === 'up' && index > 0 ) {
		index--;
	}

	if ( direction === 'down' && index + 1 < filteredCountries.value.length ) {
		index++;
	}

	activeCountry.value = filteredCountries.value[ index ].countryCode;

	await nextTick();
	updateAutocompleteScrollPosition( scrollElement );
};

const onKeySubmit = () => {
	if ( interactionState.value === InteractionState.Typing ) {
		return;
	}

	countryName.value = filteredCountries.value.find( x => x.countryCode === activeCountry.value )?.countryFullName;
};

let itemWasJustSelectedFromList = false;

const onBlur = ( selectedCountry: Country ) => {
	setTimeout( () => {
		autocompleteIsActive.value = false;

		if ( !itemWasJustSelectedFromList ) {
			emit( 'field-changed', selectedCountry );
		}
		itemWasJustSelectedFromList = false;
	}, 200 );
};

const onSelectItem = async ( selectedCountry: Country ) => {
	itemWasJustSelectedFromList = true;
	countryName.value = selectedCountry.countryFullName;
	await nextTick();
	emit( 'field-changed', selectedCountry );
};

</script>
