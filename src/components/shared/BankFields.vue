<template>
	<div class="payment-bank-data-section">
		<ScrollTarget target-id="payment-form-iban-scroll-target"/>
		<DirectDebitField
			v-model:account-number="accountNumber"
			v-model:bank-code="bankCode"
			:bank-name="bankName"
			:bic="bic"
			:account-number-type="accountNumberType"
			:show-account-number-error="showError"
			:show-bank-code-error="showError"
			:bank-validation-resource="bankValidationResource"
			@field-changed="validateFields"
		/>
	</div>
</template>

<script setup lang="ts">

import DirectDebitField from '@src/components/shared/form_fields/DirectDebitField.vue';
import { computed, inject, ref } from 'vue';
import ScrollTarget from '@src/components/shared/ScrollTarget.vue';
import { useStore } from 'vuex';
import { BankValidationResource } from '@src/api/BankValidationResource';
import { action } from '@src/store/util';
import { looksLikeBankAccountNumber, looksLikeIban } from '@src/util/bank_account_number_helpers';
import { AccountNumberType, BankAccountResponse } from '@src/view_models/BankAccount';
import { Validity } from '@src/view_models/Validity';

const store = useStore();
const bankValidationResource = inject<BankValidationResource>( 'bankValidationResource' );
const accountNumber = ref<string>( store.getters[ 'bankdata/accountNumber' ] );
const bankCode = ref<string>( store.getters[ 'bankdata/bankCode' ] );
const bankName = computed<string>( () => store.getters[ 'bankdata/bankName' ] );
const bic = computed<string>( () => store.getters[ 'bankdata/bic' ] );
const showError = computed<boolean>( () => store.getters[ 'bankdata/bankDataIsInvalid' ] );
const accountNumberType = computed<AccountNumberType>( () => {
	if ( looksLikeIban( accountNumber.value ) ) {
		return AccountNumberType.IBAN;
	}
	if ( looksLikeBankAccountNumber( accountNumber.value ) ) {
		return AccountNumberType.Account;
	}
	return AccountNumberType.None;
} );

const validateFields = async ( fieldName: 'account-number' | 'bank-code' ): Promise<void> => {
	if ( fieldName === 'account-number' ) {
		await store.dispatch( action( 'bankdata', 'setAccountNumber' ), accountNumber.value );
	}

	if ( fieldName === 'bank-code' ) {
		await store.dispatch( action( 'bankdata', 'setBankCode' ), bankCode.value );
	}

	if ( accountNumberType.value !== AccountNumberType.Account || fieldName === 'bank-code' ) {
		await store.dispatch( action( 'bankdata', 'markEmptyFieldsAsInvalid' ) );
	}

	if ( !store.getters[ 'bankdata/bankDataIsValid' ] ) {
		return Promise.resolve();
	}

	let response: BankAccountResponse;
	await store.dispatch( action( 'bankdata', 'setValidating' ), true );

	try {
		if ( accountNumberType.value === AccountNumberType.IBAN ) {
			response = await bankValidationResource.validateIban( {
				iban: accountNumber.value.toUpperCase(),
			} );
			await store.dispatch( action( 'bankdata', 'setAccountNumber' ), response.iban );
			await store.dispatch( action( 'bankdata', 'setBankCode' ), '' );
		} else {
			response = await bankValidationResource.validateBankNumber( {
				accountNumber: accountNumber.value,
				bankCode: bankCode.value,
			} );
			await store.dispatch( action( 'bankdata', 'setAccountNumber' ), response.accountNumber );
			await store.dispatch( action( 'bankdata', 'setBankCode' ), response.bankCode );
		}

		await store.dispatch( action( 'bankdata', 'setBankDataValidity' ), Validity.VALID );
		await store.dispatch( action( 'bankdata', 'setBankName' ), response.bankName );
		await store.dispatch( action( 'bankdata', 'setIban' ), response.iban );
		await store.dispatch( action( 'bankdata', 'setBic' ), response.bic );
	} catch ( e ) {
		await store.dispatch( action( 'bankdata', 'setBankDataValidity' ), Validity.INVALID );
		await store.dispatch( action( 'bankdata', 'setBankName' ), '' );
		await store.dispatch( action( 'bankdata', 'setIban' ), '' );
		await store.dispatch( action( 'bankdata', 'setBic' ), '' );
	}

	await store.dispatch( action( 'bankdata', 'setValidating' ), false );
};

store.watch( ( state, getters ) => getters[ 'bankdata/accountNumber' ], ( newAccountNumber: string ) => {
	accountNumber.value = newAccountNumber;
} );

store.watch( ( state, getters ) => getters[ 'bankdata/bankCode' ], ( newBankCode: string ) => {
	bankCode.value = newBankCode;
} );

</script>
