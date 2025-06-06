<template>
	<div class="form-section-iban">
		<div class="form-section-iban-title">
			<h2 class="form-subtitle">{{ $t( 'donation_form_payment_bankdata_title' ) }}</h2>

			<ButtonLink class="calculate-iban-button" aria-controls="iban-calculator" :aria-expanded="showCalculator" @click="showCalculator = !showCalculator">
				{{ $t( 'donation_form_iban_calculator_button' ) }}
			</ButtonLink>
		</div>

		<form
			id="iban-calculator"
			class="iban-calculator" @submit.prevent="submitBankAccount"
			:class="{ 'visible': showCalculator }"
			:style="{ '--iban-calculator-page-transition' : calculatorPageTransitionMilliseconds + 'ms' }"
		>
			<ScrollTarget target-id="iban-calculator-scroll-target"/>

			<div class="iban-calculator-content">
				<h3 class="icon-title">
					<BankIcon/> {{ $t( 'donation_form_iban_calculator_title' ) }}
				</h3>

				<button class="iban-calculator-close" @click.prevent="showCalculator = false" aria-controls="iban-calculator">
					<span class="is-sr-only">{{ $t( 'close' ) }}</span>
					<CloseIcon/>
				</button>

				<div class="iban-calculator-pages" :class="{ 'page-2': calculatorPage === 2 }">
					<div class="iban-calculator-scroller" tabindex="-1">
						<div class="iban-calculator-page" :inert="calculatorPage === 2" tabindex="-1">
							<p>{{ $t( 'donation_form_iban_calculator_help_text' ) }}</p>
							<TextField
								v-model="accountNumber"
								name="account-number"
								input-id="account-number"
								:label="$t( 'donation_form_payment_bankdata_account_legacy_label' )"
								placeholder=""
								:show-error="accountNumberError"
								:error-message="$t( 'donation_form_account_number_error' )"
								@field-changed="validateAccountNumber"
							/>

							<TextField
								v-model="bankCode"
								name="bank-code"
								input-id="bank-code"
								:label="$t( 'donation_form_payment_bankdata_bank_legacy_label' )"
								:placeholder="$t( 'donation_form_payment_bankdata_bank_legacy_placeholder' )"
								:show-error="bankCodeError"
								:error-message="$t( 'donation_form_bank_code_error' )"
								@field-changed="validateBankCode"
							/>

							<ErrorSummary :is-visible="showCalculatorErrorSummary" :focus-on-submit="false" :items="[
								{
									validity: accountNumberError ? Validity.INVALID : Validity.VALID,
									message: $t( 'donation_form_account_number_error' ),
									focusElement: 'account-number',
									scrollElement: 'iban-calculator-scroll-target'
								},
								{
									validity: bankCodeError ? Validity.INVALID : Validity.VALID,
									message: $t( 'donation_form_bank_code_error' ),
									focusElement: 'bank-code',
									scrollElement: 'iban-calculator-scroll-target'
								}
							]"/>

							<FormButton button-type="submit" :is-loading="isSearchingForIban">{{ $t( 'donation_form_iban_calculator_button' ) }}</FormButton>
						</div>

						<div
							ref="resultsPanel"
							class="iban-calculator-page iban-calculator-results"
							aria-labelledby="iban-calculator-results-label"
							tabindex="-1"
							:inert="calculatorPage === 1"
						>
							<div>
								<p id="iban-calculator-results-label">{{ $t( 'donation_form_iban_calculator_result_lead' ) }}</p>
								<ul class="iban-calculator-results-list">
									<li><strong>{{ $t( 'donation_form_iban_calculator_result_bank_account' ) }}</strong> {{ accountNumber }}</li>
									<li><strong>{{ $t( 'donation_form_iban_calculator_result_bank_code' ) }}</strong> {{ bankCode }}</li>
									<li><strong>{{ $t( 'donation_form_iban_calculator_result_iban' ) }}</strong> {{ foundIban }}</li>
									<li><strong>{{ $t( 'donation_form_iban_calculator_result_bic' ) }}</strong> {{ foundBic }}</li>
									<li><strong>{{ $t( 'donation_form_iban_calculator_result_bank_name' ) }}</strong> {{ foundBankName }}</li>
								</ul>
								<p>{{ $t( 'donation_form_iban_calculator_result_cta' ) }}</p>
							</div>

							<div class="iban-calculator-results-buttons">
								<FormButton @click.prevent="confirmResult">{{ $t( 'yes' ) }}</FormButton>
								<FormButton :is-outlined="true" @click.prevent="tryAgain">{{ $t( 'no' ) }}</FormButton>
							</div>
						</div>
					</div>
				</div>
			</div>
		</form>

		<form class="iban-form" @submit.prevent="() => {}">
			<ScrollTarget target-id="iban-scroll-target"/>
			<IbanField
				v-model="iban"
				:bank-name="bankName"
				:bic="bic"
				:show-error="showIbanError"
				@field-changed="validateIban"
			/>
		</form>
	</div>
</template>

<script setup lang="ts">

import { Validity } from '@src/view_models/Validity';
import ScrollTarget from '@src/components/shared/ScrollTarget.vue';
import IbanField from '@src/components/shared/form_fields/IbanField.vue';
import ButtonLink from '@src/components/shared/ButtonLink.vue';
import TextField from '@src/components/shared/form_fields/TextField.vue';
import ErrorSummary from '@src/components/shared/validation_summary/ErrorSummary.vue';
import FormButton from '@src/components/shared/form_elements/FormButton.vue';
import BankIcon from '@src/components/shared/icons/BankIcon.vue';
import CloseIcon from '@src/components/shared/icons/CloseIcon.vue';
import { computed, inject, onMounted, ref, watch } from 'vue';
import { BankValidationResource } from '@src/api/BankValidationResource';
import { useStore } from 'vuex';
import { BankAccountResponse } from '@src/view_models/BankAccount';
import { action } from '@src/store/util';

const bankValidationResource = inject<BankValidationResource>( 'bankValidationResource' );
const store = useStore();
const iban = ref<string>( store.state.bankdata.values.iban );
const bic = computed<string>( () => store.state.bankdata.values.bic );
const bankName = computed<string>( () => store.state.bankdata.values.bankName );
const showIbanError = computed<boolean>( () => store.state.bankdata.validity.iban === Validity.INVALID );

const showCalculator = ref<boolean>( false );
const calculatorPage = ref<1 | 2>( 1 );
const calculatorPageTransitionMilliseconds = 300;
const accountNumber = ref<string>( '' );
const bankCode = ref<string>( '' );
const accountNumberError = ref<boolean>( false );
const bankCodeError = ref<boolean>( false );
const isSearchingForIban = ref<boolean>( false );
const showCalculatorErrorSummary = ref<boolean>( false );
const resultsPanel = ref<HTMLElement>( null );
const foundIban = ref<string>( '' );
const foundBic = ref<string>( '' );
const foundBankName = ref<string>( '' );

const tryHideErrorSummary = () => {
	if ( !showCalculatorErrorSummary.value ) {
		return;
	}

	showCalculatorErrorSummary.value = accountNumberError.value || bankCodeError.value;
};

const validateAccountNumber = () => {
	accountNumberError.value = accountNumber.value === '';
	tryHideErrorSummary();
};

const validateBankCode = () => {
	bankCodeError.value = bankCode.value === '';
	tryHideErrorSummary();
};

const submitBankAccount = async () => {
	validateAccountNumber();
	validateBankCode();

	if ( accountNumberError.value || bankCodeError.value ) {
		showCalculatorErrorSummary.value = true;
		return;
	}
	isSearchingForIban.value = true;
	bankValidationResource.validateBankNumber( {
		accountNumber: accountNumber.value,
		bankCode: bankCode.value,
	} ).then( ( response: BankAccountResponse ) => {
		isSearchingForIban.value = false;
		accountNumber.value = response.accountNumber;
		bankCode.value = response.bankCode;
		foundIban.value = response.iban;
		foundBic.value = response.bic;
		foundBankName.value = response.bankName;
		calculatorPage.value = 2;

		// Focus panel after css transition has finished
		setTimeout( () => resultsPanel.value.focus(), calculatorPageTransitionMilliseconds );
	} ).catch( () => {
		isSearchingForIban.value = false;
		showCalculatorErrorSummary.value = true;
		accountNumberError.value = true;
		bankCodeError.value = true;
	} );
};

const validateIban = () => {
	store.dispatch( action( 'bankdata', 'setIban' ), iban.value );
	if ( iban.value === '' ) {
		store.dispatch( action( 'bankdata', 'setIbanValidity' ), Validity.INVALID );
		store.dispatch( action( 'bankdata', 'setBic' ), '' );
		store.dispatch( action( 'bankdata', 'setBankName' ), '' );
		return;
	}

	bankValidationResource.validateIban( {
		iban: iban.value,
	} ).then( ( response: BankAccountResponse ) => {
		store.dispatch( action( 'bankdata', 'setIbanValidity' ), Validity.VALID );
		store.dispatch( action( 'bankdata', 'setIban' ), response.iban );
		store.dispatch( action( 'bankdata', 'setBic' ), response.bic );
		store.dispatch( action( 'bankdata', 'setBankName' ), response.bankName );
	} ).catch( () => {
		store.dispatch( action( 'bankdata', 'setIbanValidity' ), Validity.INVALID );
		store.dispatch( action( 'bankdata', 'setBic' ), '' );
		store.dispatch( action( 'bankdata', 'setBankName' ), '' );
	} );
};

const confirmResult = () => {
	store.dispatch( action( 'bankdata', 'setIbanValidity' ), Validity.VALID );
	store.dispatch( action( 'bankdata', 'setIban' ), foundIban.value );
	store.dispatch( action( 'bankdata', 'setBic' ), foundBic.value );
	store.dispatch( action( 'bankdata', 'setBankName' ), foundBankName.value );
	showCalculator.value = false;
	calculatorPage.value = 1;
};

const tryAgain = () => {
	calculatorPage.value = 1;
};

onMounted( () => {
	if ( iban.value !== '' ) {
		validateIban();
	}
} );

watch( () => store.state.bankdata.values.iban, ( newIban: string ) => {
	iban.value = newIban;
} );

</script>

<style lang="scss">

@use '@src/scss/settings/global';
@use '@src/scss/settings/colors';
@use '@src/scss/settings/units';
@use '@src/scss/settings/breakpoints';
@use 'sass:map';
@use 'sass:color';

.form-section-iban {
	position: relative;

	&-title{
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		margin: 0 0 map.get( units.$spacing, 'small' );
		padding: 0 0 map.get( units.$spacing, 'small' );
		line-height: 22px;
		border-bottom: 1px solid colors.$gray-light;

		h2.form-subtitle {
			padding: 0 map.get( units.$spacing, 'small' ) 0 0;
			margin: 0;
			border: 0;
		}
	}
}

.iban-calculator {
	position: relative;
	width: 100%;
	height: 0;
	opacity: 0;
	background: colors.$primary-pale;
	visibility: hidden;
	transition: opacity 400ms ease-in-out;

	&.visible {
		height: auto;
		visibility: visible;
		opacity: 1;
		margin: 0 0 map.get(units.$spacing, 'small');
	}

	&:before {
		content: '';
		position: absolute;
		right: 20px;
		top: -10px;
		width: 0;
		height: 0;
		border-style: solid;
		border-width: 0 8px 10px 8px;
		border-color: transparent transparent colors.$primary-pale transparent;
		transform: rotate(0deg);
	}

	&-content {
		overflow: hidden;
		max-height: 100%;
	}

	&-pages {
		max-width: 100%;
		overflow-x: hidden;

		&.page-2 {
			.iban-calculator-scroller {
				transform: translateX( -50% );
			}
		}
	}

	&-scroller {
		width: 200%;
		display: flex;
		transition: transform var( --iban-calculator-page-transition ) global.$easing;
		overflow-x: hidden;
	}

	&-page {
		flex: 0 0 50%;
		padding: map.get(units.$spacing, 'small');
	}

	&-results {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	ul.iban-calculator-results-list {
		list-style-type: none;
		padding-left: 0;
	}

	&-results-buttons {
		.form-button {
			max-width: 140px;
			margin-right: map.get(units.$spacing, 'small');
		}
	}

	&-close {
		position: absolute;
		top: map.get(units.$spacing, 'x-small');
		right: map.get(units.$spacing, 'x-small');
		padding: 4px 0 0;
		width: map.get(units.$spacing, 'large');
		height: map.get(units.$spacing, 'large');
		cursor: pointer;
		border: 0;
		background: none;
		transition: background 500ms;

		svg path {
			fill: colors.$gray-dark;
			transition: fill 500ms;
		}

		&:hover,
		&:focus {
			svg path {
				fill: color.adjust(colors.$gray-dark, $lightness: -20%);
			}
		}
	}

	.icon-title {
		padding: map.get(units.$spacing, 'small') 0 0 1.5rem;
		margin: 0 map.get(units.$spacing, 'small');
		font-size: 18px;
		line-height: 25px;

		svg {
			float: left;
			margin: 4px 0 0 -1.5rem;
		}
	}
}

</style>
