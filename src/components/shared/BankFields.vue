<template>
	<div class="payment-bank-data-section">
		<ScrollTarget target-id="payment-form-iban-scroll-target"/>
		<IbanField
			v-model:iban="accountNumber"
			v-model:bic="bic"
			:show-bank-code-error="false"
			:bank-validation-resource="bankValidationResource"
			:show-iban-error="false"
		/>
	</div>
</template>

<script setup lang="ts">

import { computed, inject, ref } from 'vue';
import ScrollTarget from '@src/components/shared/ScrollTarget.vue';
import { useStore } from 'vuex';
import { BankValidationResource } from '@src/api/BankValidationResource';
import IbanField from '@src/components/shared/form_fields/IbanField.vue';

const store = useStore();
const bankValidationResource = inject<BankValidationResource>( 'bankValidationResource' );
const accountNumber = ref<string>( store.getters[ 'bankdata/accountNumber' ] );
const bankCode = ref<string>( store.getters[ 'bankdata/bankCode' ] );
const bic = computed<string>( () => store.getters[ 'bankdata/bic' ] );

store.watch( ( state, getters ) => getters[ 'bankdata/accountNumber' ], ( newAccountNumber: string ) => {
	accountNumber.value = newAccountNumber;
} );

store.watch( ( state, getters ) => getters[ 'bankdata/bankCode' ], ( newBankCode: string ) => {
	bankCode.value = newBankCode;
} );

</script>
