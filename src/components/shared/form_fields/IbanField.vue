<template>
	<div class="form-field form-field-iban" :class="[ 'form-field-text', { 'is-invalid': showError } ]" id="payment-form-iban">
		<label for="iban" class="form-field-label">
			{{ label ?? $t( 'donation_form_payment_bankdata_account_iban_label' ) }}
		</label>
		<div class="control text-form-input" :class="{ 'has-icons-right': showError }">
			<input
				ref="field"
				name="iban"
				class="input"
				id="iban"
				:class="{ 'is-danger': showError }"
				type="text"
				autocomplete="on"
				:placeholder="$t( 'donation_form_payment_bankdata_account_iban_placeholder' )"
				:aria-invalid="showError"
				:aria-describedby="ariaDescribedby"
				@blur="onBlur"
				@input="onInput"
				@paste="onInput"
			/>
		</div>
		<span v-if="showError" class="help is-danger" id="iban-error">{{ $t( 'donation_form_payment_iban_error' ) }}</span>
		<span class="field-info-message iban-bank-name" v-if="modelValue !== '' && bankName">
			{{ bankName }} ({{ bic }})
		</span>
	</div>
</template>

<script setup lang="ts">

import { nextTick, onMounted, ref, toRef, watch } from 'vue';
import { useAriaDescribedby } from '@src/components/shared/form_fields/useAriaDescribedby';

interface Props {
	modelValue: string;
	showError: boolean;
	bankName: string;
	bic: string;
	label?: String;
	ariaDescribedby?: string;
}

const props = withDefaults( defineProps<Props>(), {
	ariaDescribedby: '',
} );
const emit = defineEmits( [ 'field-changed', 'input', 'blur', 'update:modelValue' ] );

const fieldModel = ref<string>( props.modelValue );
const field = ref<HTMLInputElement>( null );
const ariaDescribedby = useAriaDescribedby(
	toRef( (): string => props.ariaDescribedby ),
	'iban-error',
	toRef( (): boolean => props.showError )
);

const getDisplayValue = ( newValue: string ) => {
	return newValue.replace( /(.{4})/g, '$& ' ).trim();
};

/**
 * 1. Get the text before the cursor
 * 2. Clear the spaces
 * 3. Add new spaces in the correct positions, but don't trim
 * 4. Return the length
 *
 * @param newValue
 * @param cursorPosition
 */
const getNewCursorPosition = ( newValue: string, cursorPosition: number ): number => {
	return newValue
		.slice( 0, cursorPosition )
		.replace( /\s/g, '' )
		.replace( /(.{4})/g, '$& ' )
		.length;
};

const setFieldValueFromModel = () => {
	field.value.value = getDisplayValue( fieldModel.value );
};

const onInput = async (): Promise<void> => {
	const newValue = field.value.value;
	const cursorPosition = field.value.selectionStart;

	const value = newValue.replace( /\s/g, '' );
	const shouldUpdateFormattedNumber = value.length > fieldModel.value.length;
	fieldModel.value = value;
	await nextTick();

	// Only update the formatted number when the donor is entering text not deleting it
	if ( shouldUpdateFormattedNumber ) {
		setFieldValueFromModel();

		// When we replace the field value the browser jumps the cursor to the end
		// so we reset it after changing the value. This allows the donor to edit
		// their bank number if they spot a mistake.
		const newCursorPosition = getNewCursorPosition( newValue, cursorPosition );
		field.value.setSelectionRange( newCursorPosition, newCursorPosition );
	}

	emit( 'update:modelValue', fieldModel.value );
	emit( 'input' );

	if ( props.showError ) {
		emit( 'field-changed', 'iban' );
	}
};

const onBlur = (): void => {
	setFieldValueFromModel();
	emit( 'field-changed', 'iban' );
	emit( 'blur' );
};

onMounted( () => {
	setFieldValueFromModel();
} );

watch( () => props.modelValue, ( newModelValue: string ) => {
	if ( fieldModel.value !== newModelValue ) {
		fieldModel.value = newModelValue;
		setFieldValueFromModel();
	}
} );

</script>
