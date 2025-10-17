<template>
	<FieldContainer input-id="iban" id="payment-form-iban" :show-error="showError">
		<template #label>
			{{ label ?? $t( 'donation_form_payment_bankdata_account_iban_label' ) }}
		</template>
		<template #field>
			<input
				ref="field"
				name="iban"
				id="iban"
				type="text"
				autocomplete="on"
				:placeholder="$t( 'donation_form_payment_bankdata_account_iban_placeholder' )"
				:aria-invalid="showError"
				:aria-describedby="ariaDescribedby"
				@blur="onBlur"
				@input="onInput"
				@paste="onInput"
			/>
		</template>
		<template #error>
			{{ $t( 'donation_form_payment_iban_error' ) }}
		</template>
		<template #message v-if="hasMessage">
			{{ bankName }} ({{ bic }})
		</template>
	</FieldContainer>
</template>

<script setup lang="ts">

import { computed, nextTick, onMounted, ref, watch } from 'vue';
import FieldContainer from '@src/components/patterns/FieldContainer.vue';
import { useAriaDescribedby } from '@src/components/shared/composables/useAriaDescribedby';

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
const hasMessage = computed<boolean>( () => props.modelValue !== '' && props.bankName !== '' );
const ariaDescribedby = useAriaDescribedby(
	'iban',
	computed<boolean>( () => false ),
	computed<boolean>( () => props.showError ),
	computed<boolean>( () => hasMessage.value )
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
