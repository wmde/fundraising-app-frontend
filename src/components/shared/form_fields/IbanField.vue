<template>

	<TextValueField
		:value="formattedIban"
		:cursor-position="bankNumberCursorPosition"
		input-id="iban"
		name="iban"
		:label="$t( 'donation_form_payment_bankdata_account_iban_label' )"
		:placeholder="$t( 'donation_form_payment_bankdata_account_iban_placeholder' )"
		:error-message="$t( 'donation_form_payment_bankdata_error' )"
		:show-error="showIbanError"
		help-text="Please enter your IBAN or your German bank account number"
		@field-changed="$emit( 'field-changed', 'account-number' )"
		@input="onAccountNumberInput"
	>
		<template #message>
			<template v-if="bankName !== ''">
				<span class="iban-bank-name">{{ bankName }} ({{ bic }})</span><br/>
			</template>
			<span>You can find your IBAN using your German account number <a href="#"
				@click.prevent="showIbanSearchForm = true">here</a>.</span>
		</template>
	</TextValueField>

	<div class="form-field-iban">
		<ModalDialogue
			id="donation-comment-modal"
			:visible="showIbanSearchForm"
			title="Find your IBAN"
			@hide="showIbanSearchForm = false"
		>
			<form v-if="!showFoundIbanDetails" id="iban-search-form" name="iban-search-form" v-on:submit.prevent="searchForIban" method="post">
				<TextField
					v-model="bankAccountNumber"
					input-id="account-number"
					name="account-number"
					:label="$t( 'donation_form_payment_bankdata_account_legacy_label' )"
					:placeholder="$t( 'donation_form_payment_bankdata_bank_legacy_placeholder' )"
					error-message=""
					:show-error="showAccountNumberError"
				/>
				<TextField
					v-model="bankCode"
					input-id="bank-code"
					name="bank-code"
					:label="$t( 'donation_form_payment_bankdata_bank_legacy_label' )"
					:placeholder="$t( 'donation_form_payment_bankdata_bank_legacy_placeholder' )"
					error-message=""
					:show-error="showAccountNumberError"
				/>
				<FormButton
					id="iban-search-form-search-button"
					:is-loading="isValidating"
					button-type="submit"
				>
					Search
				</FormButton>

			</form>

			<div v-else>
				Your account details are:
				<ul>
					<li><strong>IBAN:</strong> {{ bankAccountSearchResponse.iban }}</li>
					<li><strong>BIC:</strong> {{ bankAccountSearchResponse.bic }}</li>
					<li><strong>Bank Account Number:</strong> {{ bankAccountSearchResponse.accountNumber }}</li>
					<li><strong>Bank Name:</strong> {{ bankAccountSearchResponse.bankName }}</li>
					<li><strong>Bank Code:</strong> {{ bankAccountSearchResponse.bankCode }}</li>
				</ul>
				<FormButton
					id="iban-search-form-fill-button"
					button-type="button"
					@click.prevent="fillIban"
				>
					Use this IBAN
				</FormButton>
				<a href="#" @click.prevent="showFoundIbanDetails = false">Search again</a>
			</div>
		</ModalDialogue>
	</div>

</template>

<script setup lang="ts">

import ModalDialogue from '@src/components/shared/ModalDialogue.vue';
import { nextTick, ref, watch } from 'vue';
import TextValueField from '@src/components/shared/form_fields/TextValueField.vue';
import { BankValidationResource } from '@src/api/BankValidationResource';
import { useFieldModel } from '@src/components/shared/form_fields/useFieldModel';
import TextField from '@src/components/shared/form_fields/TextField.vue';
import FormButton from '@src/components/shared/form_elements/FormButton.vue';
import { BankAccountResponse } from '@src/view_models/BankAccount';

interface Props {
	iban: string;
	bic: string;
	showIbanError: boolean;
	showBankCodeError: boolean;
	bankValidationResource: BankValidationResource;
}

const getDisplayValue = ( newValue: string ) => {
	return newValue.replace( /(.{4})/g, '$& ' ).trim();
};

const props = defineProps<Props>();
const emit = defineEmits( [ 'field-changed', 'update:iban', 'update:bic' ] );

const showIbanSearchForm = ref<boolean>( false );
const showFoundIbanDetails = ref<boolean>( false );
const iban = useFieldModel<string>( () => props.iban, props.iban );
const bic = useFieldModel<string>( () => props.bic, props.bic );
const bankAccountNumber = ref<string>( '' );
const bankCode = ref<string>( '' );
const bankName = ref<string>( '' );
const formattedIban = ref<string>( getDisplayValue( iban.value ) );
const bankNumberCursorPosition = ref<number>( 0 );
const showAccountNumberError = ref<boolean>( false );
const isValidating = ref<boolean>( false );
const bankAccountSearchResponse = ref<BankAccountResponse>( null );

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
	iban.value = newValue.replace( /\s/g, '' );

	await nextTick();

	formattedIban.value = getDisplayValue( iban.value );

	await nextTick();

	// When we replace the field value the browser jumps the cursor to the end
	// so we reset it after changing the value. This allows the donor to edit
	// their bank number if they spot a mistake.
	bankNumberCursorPosition.value = getNewCursorPosition( newValue, cursorPosition );

	emit( 'update:iban', iban.value );
};

const searchForIban = async (): Promise<void> => {
	isValidating.value = true;
	if ( bankAccountNumber.value === '' || bankCode.value === '' ) {
		showAccountNumberError.value = true;
		isValidating.value = false;
		return Promise.resolve();
	}
	try {
		bankAccountSearchResponse.value = await props.bankValidationResource.validateBankNumber( {
			accountNumber: bankAccountNumber.value,
			bankCode: bankCode.value,
		} );
		showFoundIbanDetails.value = true;
		isValidating.value = false;
	} catch ( e ) {
		showAccountNumberError.value = true;
		isValidating.value = false;
	}
};

const fillIban = (): void => {
	showIbanSearchForm.value = false;
	bankName.value = bankAccountSearchResponse.value.bankName;
	emit( 'update:iban', bankAccountSearchResponse.value.iban );
	emit( 'update:bic', bankAccountSearchResponse.value.bic );
};

watch( iban, ( newAccountNumber: string ) => {
	formattedIban.value = getDisplayValue( newAccountNumber );
} );

</script>

<style scoped lang="scss">
#iban-search-form {
	width: 400px;
}
</style>
