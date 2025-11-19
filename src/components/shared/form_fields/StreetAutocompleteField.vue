<template>
	<div :class="{ 'flow': !isInline, 'flex-field-group' : isInline }">
		<FieldContainer :input-id="inputIdStreetName" :show-error="showError" :is-max-width-field="isMaxWidthField" class="flex-field-group__sidebar-field">
			<template #label>{{ $t( 'donation_form_street_name_label' ) }}</template>
			<template #field>
				<div class="combobox">
					<input
						type="text"
						name="street"
						v-model="streetNameModel"
						:id="inputIdStreetName"
						autocomplete="street-address"
						:placeholder="$t( 'form_for_example', { example: $t( 'donation_form_street_name_placeholder' ) } )"
						aria-controls="streets"
						:aria-invalid="showError"
						:aria-describedby="ariaDescribedby"
						aria-autocomplete="list"
						:aria-activedescendant="activeStreet ? `street-${activeStreetId}` : null"
						@focus="onStreetNameFocus"
						@blur="onStreetNameBlur"
						@input="onStreetNameInput"
						@keydown="onStreetNameKeydown"
						@keydown.up.prevent="onStreetNameKeyArrows('up')"
						@keydown.down.prevent="onStreetNameKeyArrows('down')"
						@keydown.tab="onStreetNameKeySubmit"
						@keydown.enter="onStreetNameKeySubmit"
					/>
					<transition name="fade">
						<div id="streets" ref="scrollElement" tabindex="-1" role="listbox" :aria-label="$t( 'donation_form_street_name_list_label' )" v-show="autocompleteIsActive && filteredStreets.length > 0">
							<button
								v-for="( street, index ) in filteredStreets"
								:key="street"
								tabindex="-1"
								role="option"
								:id="`street-${index}`"
								:aria-selected="street === activeStreet"
								@click="onSelectStreet( street )"
								@keyup.enter.space="onSelectStreet( street )"
							>
								{{ street }}
							</button>
						</div>
					</transition>
				</div>
			</template>
			<template #error>{{ $t( 'donation_form_street_error' ) }}</template>
			<template #message v-if="valueEqualsPlaceholderWarning.hasWarning.value">{{ valueEqualsPlaceholderWarning.warning }}</template>
		</FieldContainer>

		<TextField
			name="building-number"
			:input-id="inputIdBuildingNumber"
			:class="{ 'flex-field-group__sidebar-field-sidebar' : isInline }"
			v-model="buildingNumberModel"
			:show-error="false"
			:error-message="$t('donation_form_building_number_error')"
			:label="$t( isInline ? 'donation_form_building_number_label_short' : 'donation_form_building_number_label' )"
			:placeholder="$t( 'donation_form_building_number_placeholder' )"
			@update:modelValue="onUpdateModel"
			@field-changed="onBuildingNumberBlur"
			:is-max-width-field="isMaxWidthField"
		>
			<template #message v-if="showBuildingNumberWarning">
				{{ $t( 'donation_form_street_number_warning' ) }}
			</template>
		</TextField>
	</div>
</template>

<script setup lang="ts">
import TextField from '@src/components/shared/form_fields/TextField.vue';
import { computed, inject, nextTick, onMounted, ref, useSlots, watch } from 'vue';
import { joinStreetAndBuildingNumber, splitStreetAndBuildingNumber } from '@src/util/street_and_building_number_tools';
import { useAriaDescribedby } from '@src/components/shared/composables/useAriaDescribedby';
import { NullStreetAutocompleteResource } from '@src/api/StreetAutocompleteResource';
import type { StreetAutocompleteResource } from '@src/api/StreetAutocompleteResource';
import { useStreetsResource } from '@src/components/shared/form_fields/useStreetsResource';
import { updateAutocompleteScrollPosition } from '@src/components/shared/form_fields/updateAutocompleteScrollPosition';
import { autoscrollMaxWidth, useAutocompleteScrollIntoViewOnFocus } from '@src/components/shared/form_fields/useAutocompleteScrollIntoViewOnFocus';
import FieldContainer from '@src/components/patterns/FieldContainer.vue';
import { useValueEqualsPlaceholderWarning } from '@src/components/shared/composables/useValueEqualsPlaceholderWarning';
import { useI18n } from 'vue-i18n';

enum InteractionState {
	Typing,
	Selecting,
}

interface Props {
	inputIdStreetName: string;
	inputIdBuildingNumber: string;
	isInline?: boolean;
	scrollTargetId: string;
	modelValue: string;
	showError: boolean;
	postcode: string;
	isMaxWidthField?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits( [ 'update:modelValue', 'field-changed' ] );
const { t } = useI18n();
const slots = useSlots();

const streetNameModel = ref<string>( '' );
const buildingNumberModel = ref<string>( '' );
const buildingNumberWasBlurred = ref<boolean>( false );
const showBuildingNumberWarning = computed( () => buildingNumberWasBlurred.value && buildingNumberModel.value === '' );
const autocompleteIsActive = ref<Boolean>( false );
const { streets, fetchStreetsForPostcode } = useStreetsResource( inject<StreetAutocompleteResource>( 'streetAutocompleteResource', NullStreetAutocompleteResource ) );
const activeStreet = ref<string>();
const interactionState = ref<InteractionState>( InteractionState.Typing );
const scrollElement = ref<HTMLElement>();
const valueEqualsPlaceholderWarning = useValueEqualsPlaceholderWarning( streetNameModel, t( 'donation_form_street_name_placeholder' ), 'donation_form_street_placeholder_warning' );
const ariaDescribedby = useAriaDescribedby(
	props.inputIdStreetName,
	computed<boolean>( () => false ),
	computed<boolean>( () => props.showError ),
	computed<boolean>( () => valueEqualsPlaceholderWarning.hasWarning.value || !!slots.message )
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
const activeStreetId = computed<number>( () => filteredStreets.value.indexOf( activeStreet.value ) );

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

const onStreetNameInput = (): void => {
	if ( props.showError ) {
		emit( 'field-changed' );
	}
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
