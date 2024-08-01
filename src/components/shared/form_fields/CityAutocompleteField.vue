<template>
	<div class="form-field form-field-autocomplete" :class="{ 'is-invalid': showError }">
		<label :for="inputId" class="form-field-label">{{ label }}</label>
		<div class="form-field-autocomplete-container">
			<TextFormInput
				v-model="city"
				input-type="text"
				name="city"
				:placeholder="$t( placeholder, { example: $t( examplePlaceholder ) } )"
				:has-error="showError"
				:has-message="false"
				:input-id="inputId"
				@focus="onFocus"
				@blur="onBlur"
				@keydown="onKeydown"
				@keydown.up.prevent="onKeyArrows( 'up' )"
				@keydown.down.prevent="onKeyArrows( 'down' )"
				@keydown.tab="onKeySubmit"
				@keydown.enter="onKeySubmit"
				:aria-describedby="ariaDescribedby"
				aria-autocomplete="list"
			/>
			<span class="is-sr-only" :id="`${inputId}-selected`" aria-live="assertive">
				{{ activeCity }}
			</span>
			<transition name="fade">
				<div class="dropdown-menu" v-show="autocompleteIsActive && cities.length > 0">
					<div class="dropdown-content" ref="scrollElement" tabindex="-1">
						<template v-for="city in cities">
							<a
								class="dropdown-item"
								:class="{ 'is-active-item': city === activeCity }"
								role="button"
								tabindex="-1"
								@click.stop="onSelectItem( city )"
								@keyup.enter.space="onSelectItem( city )"
							>
								<strong>{{ postcode }}</strong> {{ city }}
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
import { computed, inject, nextTick, onMounted, ref, watch } from 'vue';
import { useCitiesResource } from '@src/components/shared/form_fields/useCitiesResource';
import { CityAutocompleteResource, NullCityAutocompleteResource } from '@src/util/CityAutocompleteResource';
import TextFormInput from '@src/components/shared/form_elements/TextFormInput.vue';
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
	examplePlaceholder: string;
	showError: boolean;
	errorMessage: String;
	postcode: string;
}

const props = defineProps<Props>();
const emit = defineEmits( [ 'field-changed', 'update:modelValue' ] );

const city = ref<string>( props.modelValue );
const autocompleteIsActive = ref<Boolean>( false );
const { cities, fetchCitiesForPostcode } = useCitiesResource( inject<CityAutocompleteResource>( 'cityAutocompleteResource', NullCityAutocompleteResource ) );
const activeCity = ref<string>();
const interactionState = ref<InteractionState>( InteractionState.Typing );
const scrollElement = ref<HTMLElement>();
const ariaDescribedby = useAriaDescribedby(
	computed<string>( () => activeCity.value ? `${props.inputId}-selected` : '' ),
	`${props.inputId}-error`,
	computed<boolean>( () => props.showError )
);

const placeholder = computed( () => {
	if ( cities.value.length > 0 ) {
		return 'form_autocomplete_prompt';
	}
	return 'form_for_example';
} );

const onFocus = ( event: Event ) => {
	autocompleteIsActive.value = true;
	( event.target as HTMLInputElement ).select();
};

const onKeydown = ( event: KeyboardEvent ) => {
	if ( [ 'ArrowUp', 'ArrowDown', 'Tab', 'Enter' ].includes( event.key ) ) {
		return true;
	}

	interactionState.value = InteractionState.Typing;
	activeCity.value = undefined;
};

const onKeyArrows = async ( direction: 'up'|'down' ) => {
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

const onBlur = () => {
	setTimeout( () => {
		autocompleteIsActive.value = false;
	}, 200 );
	emit( 'field-changed' );
};

const onSelectItem = async ( newCity: string ) => {
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

</script>

<style lang="scss">

</style>
