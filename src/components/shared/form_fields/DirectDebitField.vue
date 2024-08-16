<template>
	<div class="form-field-direct-debit">
		<TextValueField
			:value="formattedBankNumber"
			:cursor-position="bankNumberCursorPosition"
			input-id="account-number"
			name="account-number"
			:label="$t( accountNumberLabel )"
			:placeholder="$t( 'donation_form_payment_bankdata_account_iban_placeholder' )"
			:error-message="$t( 'donation_form_payment_bankdata_error' )"
			:show-error="showAccountNumberError"
			help-text="Please enter your IBAN or your German bank account number"
			@field-changed="$emit( 'field-changed', 'account-number' )"
			@input="onAccountNumberInput"
		>
			<template #message>
				<span v-if="bankName !== '' && accountNumberType === AccountNumberType.IBAN" class="iban-bank-name">{{ bankName }} ({{ bic }})</span>
			</template>
		</TextValueField>

		<TextField
			v-if="accountNumberType === AccountNumberType.Account"
			v-model="bankCode"
			input-id="bank-code"
			name="bank-code"
			:label="$t( 'donation_form_payment_bankdata_bank_legacy_label' )"
			:placeholder="$t( 'donation_form_payment_bankdata_bank_legacy_placeholder' )"
			error-message=""
			:show-error="showBankCodeError"
			help-text="It looks like you entered a bank account number, if so please enter your bank code"
			@field-changed="$emit( 'field-changed', 'bank-code' )"
			@update:model-value="onBankCodeUpdate"
		>
			<template #message>
				<span v-if="bankName !== ''" class="bank-name">{{ bankName }}</span>
			</template>
		</TextField>
	</div>
</template>

<script setup lang="ts">

import TextField from '@src/components/shared/form_fields/TextField.vue';
import { computed, nextTick, ref, watch } from 'vue';
import { BankValidationResource } from '@src/api/BankValidationResource';
import TextValueField from '@src/components/shared/form_fields/TextValueField.vue';
import { useFieldModel } from '@src/components/shared/form_fields/useFieldModel';
import { AccountNumberType } from '@src/view_models/BankAccount';

interface Props {
	accountNumber: string;
	bankCode: string;
	bankName: string;
	bic: string;
	accountNumberType: AccountNumberType
	showAccountNumberError: boolean;
	showBankCodeError: boolean;
	bankValidationResource: BankValidationResource;
}

const getDisplayValue = ( newValue: string ) => {
	return newValue.replace( /(.{4})/g, '$& ' ).trim();
};
const props = defineProps<Props>();
const emit = defineEmits( [ 'field-changed', 'update:accountNumber', 'update:bankCode' ] );

const accountNumber = useFieldModel<string>( () => props.accountNumber, props.accountNumber );
const bankCode = useFieldModel<string>( () => props.bankCode, props.bankCode );
const formattedBankNumber = ref<string>( getDisplayValue( accountNumber.value ) );
const bankNumberCursorPosition = ref<number>( 0 );

const accountNumberLabel = computed<string>( () => {
	if ( props.accountNumberType === AccountNumberType.IBAN ) {
		return 'donation_form_payment_bankdata_account_iban_label';
	} else if ( props.accountNumberType === AccountNumberType.Account ) {
		return 'donation_form_payment_bankdata_account_legacy_label';
	}
	return 'donation_form_payment_bankdata_account_default_label';
} );

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

const onAccountNumberInput = async ( newValue: string, cursorPosition: number ): Promise<void> => {
	accountNumber.value = newValue.replace( /\s/g, '' );

	await nextTick();

	formattedBankNumber.value = getDisplayValue( accountNumber.value );

	await nextTick();

	// When we replace the field value the browser jumps the cursor to the end
	// so we reset it after changing the value. This allows the donor to edit
	// their bank number if they spot a mistake.
	bankNumberCursorPosition.value = getNewCursorPosition( newValue, cursorPosition );

	emit( 'update:accountNumber', accountNumber.value );
};

const onBankCodeUpdate = ( newBankCode: string ): void => {
	emit( 'update:bankCode', newBankCode );
};

watch( accountNumber, ( newAccountNumber: string ) => {
	formattedBankNumber.value = getDisplayValue( newAccountNumber );
} );

</script>

<style lang="scss">
@use '@src/scss/settings/forms';
@use 'sass:map';

.form-field-direct-debit {
	max-width: map.get( forms.$input, 'max-width' );
}
</style>
