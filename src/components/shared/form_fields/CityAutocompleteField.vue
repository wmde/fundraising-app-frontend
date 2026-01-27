<template>
	<FieldContainer :input-id="inputId" :show-error="showError" :is-max-width-field="isMaxWidthField">
		<template #label>{{ label }}</template>
		<template #field>
			<div class="combobox">
				<input
					type="text"
					name="city"
					v-model="city"
					:id="inputId"
					autocomplete="address-level2"
					:placeholder="$t( placeholder, { example: $t( 'donation_form_city_placeholder' ) } )"
					aria-controls="cities"
					:aria-invalid="showError"
					:aria-describedby="ariaDescribedby"
					aria-autocomplete="list"
					:aria-activedescendant="activeCity ? `city-${activeCityId}` : null"
					@focus="onFocus"
					@blur="onBlur"
					@input="onInput"
					@keydown="onKeydown"
					@keydown.up.prevent="onKeyArrows('up')"
					@keydown.down.prevent="onKeyArrows('down')"
					@keydown.tab="onKeySubmit"
					@keydown.enter="onKeySubmit"
				/>
				<span class="is-sr-only" :id="`${inputId}-selected`" aria-live="assertive">
					{{ activeCity }}
				</span>
				<transition name="fade">
					<div id="cities" ref="scrollElement" tabindex="-1" role="listbox" :aria-label="$t( 'donation_form_city_list_label' )" v-show="autocompleteIsActive && cities.length > 0">
						<button
							v-for="( city, index ) in cities"
							:key="city"
							tabindex="-1"
							role="option"
							:id="`city-${index}`"
							:aria-selected="city === activeCity"
							@click="onSelectItem( city )"
							@keyup.enter.space="onSelectItem( city )"
						>
							<strong>{{ postcode }}</strong> {{ city }}
						</button>
					</div>
				</transition>
			</div>
		</template>
		<template #error>{{ errorMessage }}</template>
		<template #message v-if="valueEqualsPlaceholderWarning.hasWarning.value">{{ valueEqualsPlaceholderWarning.warning }}</template>
		<template #message v-else-if="$slots.message"><slot name="message"/></template>
	</FieldContainer>
</template>

<script setup lang="ts">
import { computed, inject, nextTick, onMounted, ref, useSlots, watch } from 'vue';
import { useCitiesResource } from '@src/components/shared/form_fields/useCitiesResource';
import type { CityAutocompleteResource } from '@src/api/CityAutocompleteResource';
import { NullCityAutocompleteResource } from '@src/api/CityAutocompleteResource';
import { updateAutocompleteScrollPosition } from '@src/components/shared/form_fields/updateAutocompleteScrollPosition';
import { useAriaDescribedby } from '@src/components/shared/composables/useAriaDescribedby';
import { autoscrollMaxWidth, useAutocompleteScrollIntoViewOnFocus } from '@src/components/shared/form_fields/useAutocompleteScrollIntoViewOnFocus';
import FieldContainer from '@src/components/patterns/FieldContainer.vue';
import { useValueEqualsPlaceholderWarning } from '@src/components/shared/composables/useValueEqualsPlaceholderWarning';
import { useI18n } from 'vue-i18n';

enum InteractionState {
	Typing,
	Selecting,
}

interface Props {
	modelValue: string;
	inputId: string;
	scrollTargetId: string;
	label: String;
	showError: boolean;
	errorMessage: String;
	postcode: string;
	isMaxWidthField?: boolean;
	ariaDescribedby?: string | undefined;
}

const props = defineProps<Props>();
const emit = defineEmits( [ 'field-changed', 'update:modelValue' ] );
const { t } = useI18n();
const slots = useSlots();

const city = ref<string>( props.modelValue );
const autocompleteIsActive = ref<Boolean>( false );
const { cities, fetchCitiesForPostcode } = useCitiesResource( inject<CityAutocompleteResource>( 'cityAutocompleteResource', NullCityAutocompleteResource ) );
const activeCity = ref<string>();
const activeCityId = computed<number>( () => cities.value.indexOf( activeCity.value ) );
const interactionState = ref<InteractionState>( InteractionState.Typing );
const scrollElement = ref<HTMLElement>();

const valueEqualsPlaceholderWarning = useValueEqualsPlaceholderWarning( city, t( 'donation_form_city_placeholder' ), 'donation_form_city_placeholder_warning' );
const ariaDescribedby = useAriaDescribedby(
	props.inputId,
	computed<boolean>( () => false ),
	computed<boolean>( () => props.showError ),
	computed<boolean>( () => valueEqualsPlaceholderWarning.hasWarning.value || !!slots.message ),
	computed<string | undefined>( () => props.ariaDescribedby )
);

const scrollIntoView = useAutocompleteScrollIntoViewOnFocus( props.scrollTargetId, autoscrollMaxWidth );

const placeholder = computed( () => {
	if ( cities.value.length > 0 ) {
		return 'form_autocomplete_prompt';
	}
	return 'form_for_example';
} );

const onFocus = ( event: Event ) => {
	autocompleteIsActive.value = true;
	scrollIntoView();
	( event.target as HTMLInputElement ).select();
};

const onKeydown = ( event: KeyboardEvent ) => {
	if ( [ 'ArrowUp', 'ArrowDown', 'Tab', 'Enter' ].includes( event.key ) ) {
		return true;
	}

	interactionState.value = InteractionState.Typing;
	activeCity.value = undefined;
};

const onKeyArrows = async ( direction: 'up' | 'down' ) => {
	interactionState.value = InteractionState.Selecting;

	if ( activeCity.value === undefined ) {
		activeCity.value = cities.value[ 0 ];
		return;
	}

	let index = cities.value.findIndex( x => x === activeCity.value );

	if ( direction === 'up' && index > 0 ) {
		index--;
	}

	if ( direction === 'down' && index + 1 < cities.value.length ) {
		index++;
	}

	activeCity.value = cities.value[ index ];

	await nextTick();
	updateAutocompleteScrollPosition( scrollElement );
};

const onKeySubmit = () => {
	if ( interactionState.value === InteractionState.Typing ) {
		return;
	}

	city.value = activeCity.value;
};

let itemWasJustSelectedFromList = false;

const onInput = (): void => {
	if ( props.showError ) {
		emit( 'field-changed' );
	}
};

const onBlur = () => {
	setTimeout( () => {
		autocompleteIsActive.value = false;
		if ( !itemWasJustSelectedFromList ) {
			emit( 'field-changed' );
		}
		itemWasJustSelectedFromList = false;
	}, 200 );
};

const onSelectItem = async ( newCity: string ) => {
	itemWasJustSelectedFromList = true;
	city.value = newCity;
	await nextTick();
	emit( 'field-changed' );
};

onMounted( () => {
	fetchCitiesForPostcode( props.postcode as string );
} );

watch( (): string => props.postcode as string, ( value: string ) => {
	fetchCitiesForPostcode( value );
} );

watch( city, ( newCity: string ) => {
	emit( 'update:modelValue', newCity );
} );

watch( () => props.modelValue, ( newValue: string ) => {
	city.value = newValue;
} );

</script>
