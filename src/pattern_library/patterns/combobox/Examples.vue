<template>
	<div class="content-card flow">
		<div class="section-heading">
			<h2>Combobox Example</h2>
			<hr/>
		</div>

		<p>Please bear in mind that this is as simple an example as possible. You will have different requirements when implementing one of these for production so this is not an entire solution but will only be your starting point.</p>

		<div class="field-container flow">
			<label for="country">Country</label>
			<div class="combobox">
				<input
					ref="inputField"
					type="text"
					name="country"
					id="country"
					v-model="country"
					role="combobox"
					aria-controls="countries"
					:aria-expanded="expanded"
					:aria-activedescendant="selectedCountry ? `option-${selectedCountry}` : null"
					@focus="expanded = true"
					@blur="expanded = false"
					@keydown="onKeydown"
					@keydown.up.prevent="onArrowKeys( 'up' )"
					@keydown.down.prevent="onArrowKeys( 'down' )"
					@keydown.tab="onKeySubmit"
					@keydown.enter="onKeySubmit"
				>
				<div ref="scroller" id="countries" tabindex="-1" role="listbox" aria-label="countries">
					<template v-for="(countryOption, index) in filteredCountries" :key="index">
						<hr v-if="index === 3"/><!-- This is hardcoded, you'll need a programmatic way of adding them in in production if needed -->
						<button
							role="option"
							tabindex="-1"
							:id="`option-${countryOption}`"
							:aria-selected="selectedCountry == countryOption"
							@click="onSelectOption( countryOption )"
						>
							{{ countryOption }}
						</button>
					</template>
				</div>
			</div>
			<p class="field-container__error-text">Please enter a country.</p>
		</div>
	</div>
</template>
<script setup lang="ts">
import { computed, nextTick, Ref, ref } from 'vue';

defineOptions( { inheritAttrs: false } );

const countries: string[] = [
	'Germany',
	'Ireland',
	'France',
	'The Great and Excellent Nation of the Two Line Country Name to Test in the Combobox',
	'Spain',
	'Morocco',
	'Italy',
	'Iceland',
	'China',
	'Korea',
	'Australia',
];

enum InteractionState {
	Typing,
	Selecting,
}

const inputField = ref<HTMLInputElement>( null );
const scroller = ref<HTMLElement>( null );
const country = ref<string>( '' );
const selectedCountry = ref<string>();
const expanded = ref<boolean>( false );
const interactionState = ref<InteractionState>( InteractionState.Typing );
const filteredCountries = computed<string[]>( () => {
	const countryList = countries.filter( ( countryOption: string ) => {
		return countryOption
			.toLowerCase()
			.indexOf( country.value.trim().toLowerCase() ) >= 0;
	} );

	return countryList.length > 0 ? countryList : countries;
} );

/**
 * This makes sure that the selected item in the combobox scroller is always in view, it should usually live
 * in a composable as the code will be shared between multiple types of combobox
 *
 * @param scrollElement
 */
function updateAutocompleteScrollPosition( scrollElement: Ref<HTMLElement> ): void {
	const element = scrollElement.value.querySelector<HTMLElement>( '[aria-selected="true"]' );

	if ( element === null ) {
		scrollElement.value.scrollTop = 0;
		return;
	}

	const visMin = scrollElement.value.scrollTop;
	const visMax = scrollElement.value.scrollTop + scrollElement.value.clientHeight - element.clientHeight;

	if ( element.offsetTop < visMin ) {
		scrollElement.value.scrollTop = element.offsetTop;
	} else if ( element.offsetTop >= visMax ) {
		scrollElement.value.scrollTop = element.offsetTop - scrollElement.value.clientHeight + element.clientHeight;
	}
}

/**
 * We capture all events on keydown, but we want to make sure we ignore the ones that are used for navigating the list
 *
 * @param event
 */
const onKeydown = ( event: KeyboardEvent ) => {
	if ( [ 'Up', 'ArrowUp', 'Down', 'ArrowDown', 'Tab', 'Enter' ].includes( event.key ) ) {
		return true;
	}

	interactionState.value = InteractionState.Typing;
	selectedCountry.value = undefined;
};

/**
 * We capture the arrow key inputs separately and use this to scroll the elements in the list
 *
 * @param direction
 */
const onArrowKeys = async ( direction: 'up' | 'down' ) => {
	interactionState.value = InteractionState.Selecting;

	if ( selectedCountry.value === '' ) {
		selectedCountry.value = filteredCountries.value[ 0 ];
		return;
	}

	let index = filteredCountries.value.findIndex( x => x === selectedCountry.value );

	if ( direction === 'up' && index > 0 ) {
		index--;
	}

	if ( direction === 'down' && index + 1 < filteredCountries.value.length ) {
		index++;
	}

	selectedCountry.value = filteredCountries.value[ index ];

	// We need to wait for the selected value to change
	await nextTick();

	updateAutocompleteScrollPosition( scroller );
};

/**
 * When the donor clicks an option in the list
 *
 * @param newCountry
 */
const onSelectOption = ( newCountry: string ) => {
	country.value = newCountry;
	selectedCountry.value = newCountry;
	inputField.value.focus();
};

/**
 * When the donor is navigating the list, and they hit the enter or tab key
 */
const onKeySubmit = () => {
	if ( interactionState.value === InteractionState.Typing ) {
		return;
	}

	country.value = filteredCountries.value.find( x => x === selectedCountry.value );
};

</script>
