<template>
	<FieldContainer :input-id="inputId" :show-error="showError" :is-max-width-field="isMaxWidthField">
		<template #label>{{ $t( 'donation_form_country_label' ) }}</template>
		<template #field>
			<div class="combobox">
				<input
					type="text"
					name="countrySelector"
					v-model="countryName"
					:id="inputId"
					autocomplete="country"
					:placeholder="$t( 'form_for_example', { example: countries[0].countryFullName } )"
					aria-controls="countries"
					:aria-invalid="showError"
					:aria-describedby="ariaDescribedby"
					aria-autocomplete="list"
					:aria-activedescendant="activeCountry ? `country-${activeCountry}` : null"
					@focus="onFocus"
					@blur="() => onBlur( country )"
					@input="onInput"
					@keydown="onKeydown"
					@keydown.up.prevent="onKeyArrows('up')"
					@keydown.down.prevent="onKeyArrows('down')"
					@keydown.tab="onKeySubmit"
					@keydown.enter="onKeySubmit"
				/>
				<span class="is-sr-only" :id="`${inputId}-selected`" aria-live="assertive">
					{{ activeCountryName }}
				</span>
				<input type="hidden" name="country" :value="country?.countryCode">
				<transition name="fade">
					<div id="countries" ref="scrollElement" tabindex="-1" role="listbox" :aria-label="$t( 'donation_form_country_list_label' )" v-show="autocompleteIsActive">
						<template v-for="( country, index ) in filteredCountries" :key="index">
							<hr v-if="groupSeparatorIndex === index">
							<button
								tabindex="-1"
								role="option"
								:id="`country-${country.countryCode}`"
								:aria-selected="country.countryCode === activeCountry"
								@click="() => onSelectItem( country )"
								@keyup.enter.space="onSelectItem(country)"
							>
								{{ country.countryFullName }}
							</button>
						</template>
					</div>
				</transition>
			</div>
		</template>
		<template #error>{{ $t('donation_form_country_error') }}</template>
	</FieldContainer>
</template>

<script setup lang="ts">

import { useCountryInput } from '@src/components/shared/form_fields/useCountryInput';
import { useFilteredCountries } from '@src/components/shared/form_fields/useFilteredCountries';
import type { Country } from '@src/view_models/Country';
import { computed, nextTick, ref } from 'vue';
import { updateAutocompleteScrollPosition } from '@src/components/shared/form_fields/updateAutocompleteScrollPosition';
import { useAriaDescribedby } from '@src/components/shared/composables/useAriaDescribedby';
import { autoscrollMaxWidth, useAutocompleteScrollIntoViewOnFocus } from '@src/components/shared/form_fields/useAutocompleteScrollIntoViewOnFocus';
import FieldContainer from '@src/components/patterns/FieldContainer.vue';

enum InteractionState {
	Typing,
	Selecting,
}

interface Props {
	modelValue: string;
	inputId: string;
	scrollTargetId: string;
	countries?: Array<Country>;
	showError: boolean;
	wasRestored: boolean;
	isMaxWidthField?: boolean;
	ariaDescribedby?: string | null;
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
	props.inputId,
	computed<boolean>( () => false ),
	computed<boolean>( () => props.showError ),
	computed<boolean>( () => false ),
	computed<string | null>( () => props.ariaDescribedby )
);

const scrollIntoView = useAutocompleteScrollIntoViewOnFocus( props.scrollTargetId, autoscrollMaxWidth );

const isFirstFocusOnDefaultValue = (): boolean => {
	return !wasFocusedBefore.value && !props.wasRestored;
};

const onFocus = ( event: Event ) => {
	if ( isFirstFocusOnDefaultValue() ) {
		countryName.value = '';
	}
	wasFocusedBefore.value = true;

	autocompleteIsActive.value = true;
	scrollIntoView();
	( event.target as HTMLInputElement ).select();
};

const onKeydown = ( event: KeyboardEvent ) => {
	if ( [ 'ArrowUp', 'ArrowDown', 'Tab', 'Enter' ].includes( event.key ) ) {
		return true;
	}

	interactionState.value = InteractionState.Typing;
	activeCountry.value = undefined;
};

const onKeyArrows = async ( direction: 'up' | 'down' ) => {
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

const onInput = async (): Promise<void> => {
	if ( props.showError ) {
		await nextTick();
		emit( 'field-changed', country.value );
	}
};

const onBlur = ( selectedCountry: Country ) => {
	setTimeout( () => {
		autocompleteIsActive.value = false;

		if ( !itemWasJustSelectedFromList ) {
			emit( 'field-changed', selectedCountry ?? '' );
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
