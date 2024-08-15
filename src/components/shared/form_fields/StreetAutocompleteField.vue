<template>
	<ScrollTarget :target-id="`${inputIdStreetName}-scroll-target`"/>
	<TextField
		name="street"
		:input-id="inputIdStreetName"
		v-model="streetNameModel"
		:show-error="showError"
		:error-message="$t('donation_form_street_error')"
		autocomplete="street-address"
		:label="$t( 'donation_form_street_name_label' )"
		:placeholder="$t( 'form_for_example', { example: $t( 'donation_form_street_name_placeholder' ) } )"
		@update:modelValue="onUpdateModel"
		@field-changed="$emit( 'field-changed', 'street' )"
	>
		<template #message>
			<ValueEqualsPlaceholderWarning
				:value="streetNameModel"
				:placeholder="$t( 'donation_form_street_name_placeholder' )"
				:warning="'donation_form_street_placeholder_warning'"
			/>
		</template>
	</TextField>
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
			<span
				v-if="showBuildingNumberWarning"
				class="street-number-warning help"
			>{{ $t( 'donation_form_street_number_warning' ) }}</span>
		</template>
	</TextField>
</template>

<script setup lang="ts">
import TextField from '@src/components/shared/form_fields/TextField.vue';
import ScrollTarget from '@src/components/shared/ScrollTarget.vue';
import { computed, onMounted, ref, watch } from 'vue';
import ValueEqualsPlaceholderWarning from '@src/components/shared/ValueEqualsPlaceholderWarning.vue';
import { joinStreetAndBuildingNumber, splitStreetAndBuildingNumber } from '@src/util/street_and_building_number_tools';

interface Props {
	inputIdStreetName: string;
	inputIdBuildingNumber: string;
	modelValue: string;
	showError: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits( [ 'update:modelValue', 'field-changed' ] );

const streetNameModel = ref<string>( '' );
const buildingNumberModel = ref<string>( '' );
const buildingNumberWasBlurred = ref<boolean>( false );
const showBuildingNumberWarning = computed( () => buildingNumberWasBlurred.value && buildingNumberModel.value === '' );

const setModelValues = ( newValue: string ) => {
	const values = splitStreetAndBuildingNumber( newValue );
	streetNameModel.value = values.street;
	buildingNumberModel.value = values.buildingNumber;
};

onMounted( () => setModelValues( props.modelValue ) );
watch( () => props.modelValue, ( newValue: string ) => setModelValues( newValue ) );

const onUpdateModel = (): void => {
	emit( 'update:modelValue', joinStreetAndBuildingNumber( streetNameModel.value, buildingNumberModel.value ) );
};

const onBuildingNumberBlur = (): void => {
	buildingNumberWasBlurred.value = true;
	emit( 'field-changed', 'street' );
};

</script>
