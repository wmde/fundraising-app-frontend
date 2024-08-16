<template>
	<div class="form-field-direct-debit">
		<div class="form-field" :class="[ 'form-field-text', { 'is-invalid': showAccountNumberError } ]">
			<label for="account-number" class="form-field-label">
				{{ $t( accountNumberLabel ) }}
			</label>
			<div class="form-field-help-text" id="account-number-help-text">
				{{ $t( 'donation_form_payment_bankdata_account_iban_help_text' ) }}
			</div>
			<div class="control text-form-input" :class="{ 'has-icons-right': showAccountNumberError }">
				<input
					ref="accountNumberField"
					name="account-number"
					class="input"
					id="account-number"
					:class="{ 'is-danger': showAccountNumberError }"
					type="text"
					autocomplete="on"
					:placeholder="$t( 'donation_form_payment_bankdata_account_iban_placeholder' )"
					:aria-invalid="showAccountNumberError"
					:aria-describedby="ariaDescribedby"
					@blur="onBlurAccountNumber"
					@input="onAccountNumberInput"
					@paste="onAccountNumberInput"
				/>
			</div>
			<span v-if="showAccountNumberError" class="help is-danger" id="account-number-error">{{ $t( 'donation_form_payment_bankdata_error' ) }}</span>
			<span class="field-info-message iban-bank-name" v-if="bankName && accountNumberType === AccountNumberType.IBAN">
				{{ bankName }} ({{ bic }})
			</span>
		</div>

		<TextField
			v-if="accountNumberType === AccountNumberType.Account"
			v-model="bankCode"
			input-id="bank-code"
			name="bank-code"
			:label="$t( 'donation_form_payment_bankdata_bank_legacy_label' )"
			:placeholder="$t( 'donation_form_payment_bankdata_bank_legacy_placeholder' )"
			error-message=""
			:show-error="showBankCodeError"
			:help-text="$t( 'donation_form_payment_bankdata_bank_legacy_help_text' )"
			@field-changed="$emit( 'field-changed', 'bank-code' )"
			@update:model-value="onBankCodeUpdate"
		>
			<template #message>
				<span v-if="bankName" class="bank-name">{{ bankName }}</span>
			</template>
		</TextField>
	</div>
</template>

<script setup lang="ts">

import TextField from '@src/components/shared/form_fields/TextField.vue';
import { computed, nextTick, onMounted, ref } from 'vue';
import { BankValidationResource } from '@src/api/BankValidationResource';
import { useFieldModel } from '@src/components/shared/form_fields/useFieldModel';
import { AccountNumberType } from '@src/view_models/BankAccount';
import { useAriaDescribedby } from '@src/components/shared/form_fields/useAriaDescribedby';

interface Props {
	accountNumber: string;
	bankCode: string;
	bankName?: string;
	bic: string;
	accountNumberType: AccountNumberType
	showAccountNumberError: boolean;
	showBankCodeError: boolean;
	bankValidationResource: BankValidationResource;
}
const props = defineProps<Props>();
const emit = defineEmits( [ 'field-changed', 'update:accountNumber', 'update:bankCode' ] );

const accountNumber = useFieldModel<string>( () => props.accountNumber, props.accountNumber );
const bankCode = useFieldModel<string>( () => props.bankCode, props.bankCode );
const accountNumberField = ref<HTMLInputElement>( null );

const accountNumberLabel = computed<string>( () => {
	if ( props.accountNumberType === AccountNumberType.IBAN ) {
		return 'donation_form_payment_bankdata_account_iban_label';
	} else if ( props.accountNumberType === AccountNumberType.Account ) {
		return 'donation_form_payment_bankdata_account_legacy_label';
	}
	return 'donation_form_payment_bankdata_account_default_label';
} );

const ariaDescribedby = useAriaDescribedby(
	ref<string>( 'account-number-help-text' ),
	'account-number-error',
	computed<boolean>( () => props.showAccountNumberError )
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

const onAccountNumberInput = async (): Promise<void> => {
	const newValue = accountNumberField.value.value;
	const cursorPosition = accountNumberField.value.selectionStart;

	const value = newValue.replace( /\s/g, '' );
	const shouldUpdateFormattedNumber = value.length > accountNumber.value.length;
	accountNumber.value = value;
	await nextTick();

	// Only update the formatted number when the donor is entering text not deleting it
	if ( shouldUpdateFormattedNumber ) {
		accountNumberField.value.value = getDisplayValue( accountNumber.value );

		// When we replace the field value the browser jumps the cursor to the end
		// so we reset it after changing the value. This allows the donor to edit
		// their bank number if they spot a mistake.
		const newCursorPosition = getNewCursorPosition( newValue, cursorPosition );
		accountNumberField.value.setSelectionRange( newCursorPosition, newCursorPosition );
	}

	emit( 'update:accountNumber', accountNumber.value );
};

const onBlurAccountNumber = (): void => {
	accountNumberField.value.value = getDisplayValue( accountNumber.value );
	emit( 'field-changed', 'account-number' );
};

const onBankCodeUpdate = ( newBankCode: string ): void => {
	emit( 'update:bankCode', newBankCode );
};

onMounted( () => {
	accountNumberField.value.value = getDisplayValue( accountNumber.value );
} );

</script>

<style lang="scss">
@use '@src/scss/settings/forms';
@use 'sass:map';

.form-field-direct-debit {
	max-width: map.get( forms.$input, 'max-width' );
}
</style>
