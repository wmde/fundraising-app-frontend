<template>
	<div class="form-field form-field-autocomplete" :class="{ 'is-invalid': showError }">
		<label :for="inputIdStreetName" class="form-field-label">{{ $t( 'donation_form_street_name_label' ) }}</label>
		<div class="form-field-autocomplete-container">
			<TextFormInput
				v-model="streetNameModel"
				input-type="text"
				name="street"
				:placeholder="$t( 'form_for_example', { example: $t( 'donation_form_street_name_placeholder' ) } )"
				:has-error="showError"
				:has-message="false"
				:input-id="inputIdStreetName"
				@focus="onStreetNameFocus"
				@blur="onStreetNameBlur"
				@keydown="onStreetNameKeydown"
				@keydown.up.prevent="onStreetNameKeyArrows( 'up' )"
				@keydown.down.prevent="onStreetNameKeyArrows( 'down' )"
				@keydown.tab="onStreetNameKeySubmit"
				@keydown.enter="onStreetNameKeySubmit"
				:aria-describedby="ariaDescribedby"
				aria-autocomplete="list"
			/>
			<span class="is-sr-only" :id="`${inputIdStreetName}-selected`" aria-live="assertive">
				{{ activeStreet }}
			</span>
			<transition name="fade">
				<div class="dropdown-menu" v-show="autocompleteIsActive && filteredStreets.length > 0">
					<div class="dropdown-content" ref="scrollElement" tabindex="-1">
						<a
							v-for="street in filteredStreets"
							class="dropdown-item"
							:class="{ 'is-active-item': street === activeStreet }"
							:key="street"
							role="button"
							tabindex="-1"
							@click.stop="onSelectStreet( street )"
							@keyup.enter.space="onSelectStreet( street )"
						>
							{{ street }}
						</a>
					</div>
				</div>
			</transition>
		</div>
		<span v-if="showError" class="help is-danger" :id="`${inputIdStreetName}-error`">{{ errorMessage }}</span>
		<ValueEqualsPlaceholderWarning
			:value="streetNameModel"
			:placeholder="$t( 'donation_form_street_placeholder' )"
			:warning="'donation_form_street_placeholder_warning'"
		/>
	</div>

	<TextField
		name="building-number"
		:input-id="inputIdBuildingNumber"
		v-model="buildingNumberModel"
		:show-error="false"
		:error-message="$t('donation_form_building_number_error')"
		:label="$t( 'donation_form_building_number_label' )"
		:placeholder="$t( 'form_for_example', { example: $t( 'donation_form_building_number_placeholder' ) } )"
		@update:modelValue="onUpdateModel"
		@field-changed="onBuildingNumberBlur"
	>
		<template #message>
			<span v-if="showBuildingNumberWarning" class="street-number-warning help">
				{{ $t( 'donation_form_street_number_warning' ) }}
			</span>
		</template>
	</TextField>
</template>

<script setup lang="ts">
import TextField from '@src/components/shared/form_fields/TextField.vue';
import { computed, inject, nextTick, onMounted, ref, watch } from 'vue';
import { joinStreetAndBuildingNumber, splitStreetAndBuildingNumber } from '@src/util/street_and_building_number_tools';
import { useAriaDescribedby } from '@src/components/shared/form_fields/useAriaDescribedby';
import { NullStreetAutocompleteResource, StreetAutocompleteResource } from '@src/api/StreetAutocompleteResource';
import { useStreetsResource } from '@src/components/shared/form_fields/useStreetsResource';
import TextFormInput from '@src/components/shared/form_elements/TextFormInput.vue';
import { updateAutocompleteScrollPosition } from '@src/components/shared/form_fields/updateAutocompleteScrollPosition';
import ValueEqualsPlaceholderWarning from '@src/components/shared/ValueEqualsPlaceholderWarning.vue';
import { autoscrollMaxWidth, useAutocompleteScrollIntoViewOnFocus } from '@src/components/shared/form_fields/useAutocompleteScrollIntoViewOnFocus';

enum InteractionState {
	Typing,
	Selecting,
}

interface Props {
	inputIdStreetName: string;
	inputIdBuildingNumber: string;
	scrollTargetId: string;
	modelValue: string;
	showError: boolean;
	errorMessage: String;
	postcode: string;
}

const props = defineProps<Props>();
const emit = defineEmits( [ 'update:modelValue', 'field-changed' ] );

const streetNameModel = ref<string>( '' );
const buildingNumberModel = ref<string>( '' );
const buildingNumberWasBlurred = ref<boolean>( false );
const showBuildingNumberWarning = computed( () => buildingNumberWasBlurred.value && buildingNumberModel.value === '' );
const autocompleteIsActive = ref<Boolean>( false );
const { streets, fetchStreetsForPostcode } = useStreetsResource( inject<StreetAutocompleteResource>( 'streetAutocompleteResource', NullStreetAutocompleteResource ) );
const activeStreet = ref<string>();
const interactionState = ref<InteractionState>( InteractionState.Typing );
const scrollElement = ref<HTMLElement>();
const ariaDescribedby = useAriaDescribedby(
	computed<string>( () => activeStreet.value ? `${props.inputIdStreetName}-selected` : '' ),
	`${props.inputIdStreetName}-error`,
	computed<boolean>( () => props.showError )
);
const scrollIntoView = useAutocompleteScrollIntoViewOnFocus( props.scrollTargetId, autoscrollMaxWidth );

const filteredStreets = computed<Array<string>>( () => {
	const streetList = streets.value.filter( ( streetItem: string ) => {
		return streetItem
			.toLowerCase()
			.startsWith( streetNameModel.value.trim().toLowerCase() );
	} );

	return streetNameModel.value !== '' || streetList.length > 0 ? streetList : streets.value;
} );

const onUpdateModel = (): void => {
	emit( 'update:modelValue', joinStreetAndBuildingNumber( streetNameModel.value, buildingNumberModel.value ) );
};

const onStreetNameFocus = ( event: Event ) => {
	autocompleteIsActive.value = true;
	scrollIntoView();
	( event.target as HTMLInputElement ).select();
};

const onStreetNameKeydown = ( event: KeyboardEvent ) => {
	if ( [ 'ArrowUp', 'ArrowDown', 'Tab', 'Enter' ].includes( event.key ) ) {
		return true;
	}

	interactionState.value = InteractionState.Typing;
	activeStreet.value = undefined;
	updateAutocompleteScrollPosition( scrollElement );
};

const onStreetNameKeyArrows = async ( direction: 'up' | 'down' ) => {
	interactionState.value = InteractionState.Selecting;

	if ( activeStreet.value === undefined ) {
		activeStreet.value = filteredStreets.value[ 0 ];
		return;
	}

	let index = filteredStreets.value.findIndex( x => x === activeStreet.value );

	if ( direction === 'up' && index > 0 ) {
		index--;
	}

	if ( direction === 'down' && index + 1 < filteredStreets.value.length ) {
		index++;
	}

	activeStreet.value = filteredStreets.value[ index ];

	await nextTick();
	updateAutocompleteScrollPosition( scrollElement );
};

const onStreetNameKeySubmit = () => {
	if ( interactionState.value === InteractionState.Typing ) {
		return;
	}

	streetNameModel.value = activeStreet.value;
};

let itemWasJustSelectedFromList = false;

const onStreetNameBlur = () => {
	setTimeout( () => {
		autocompleteIsActive.value = false;
		if ( !itemWasJustSelectedFromList ) {
			emit( 'field-changed' );
		}
		itemWasJustSelectedFromList = false;
	}, 200 );
};

const onSelectStreet = async ( newStreet: string ) => {
	itemWasJustSelectedFromList = true;
	streetNameModel.value = newStreet;
	await nextTick();
	emit( 'field-changed' );
};

const setModelValues = ( newValue: string ) => {
	const values = splitStreetAndBuildingNumber( newValue );
	streetNameModel.value = values.street;
	buildingNumberModel.value = values.buildingNumber;
};

onMounted( () => {
	setModelValues( props.modelValue );
	fetchStreetsForPostcode( props.postcode );
} );
watch( () => props.modelValue, ( newValue: string ) => setModelValues( newValue ) );
watch( () => props.postcode, ( value: string ) => fetchStreetsForPostcode( value ) );
watch( streetNameModel, onUpdateModel );

const onBuildingNumberBlur = (): void => {
	buildingNumberWasBlurred.value = true;
	emit( 'field-changed' );
};

</script>
