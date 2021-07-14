<template>
	<div class="address-page">
		<h1 v-if="!paymentWasInitialized" class="title is-size-1">{{ $t( 'donation_form_section_headline' ) }}</h1>
		<payment-summary v-if="paymentWasInitialized"
						:amount="paymentSummary.amount"
						:payment-type="paymentSummary.paymentType"
						:interval="paymentSummary.interval"
						v-on:previous-page="previousPage">
		</payment-summary>

		<payment-bank-data
				v-if="isDirectDebit"
				:validateBankDataUrl="validateBankDataUrl"
				:validateLegacyBankDataUrl="validateLegacyBankDataUrl"
		/>

		<address-type
				v-on:address-type="setAddressType( $event )"
				v-on:set-full-selected="setFullSelected"
				:disabledAddressTypes="disabledAddressTypes"
				:is-direct-debit="isDirectDebit"
				:initial-address-type="addressTypeName"
		/>
		<span
				v-if="addressTypeIsInvalid"
				class="help is-danger">{{ $t( 'donation_form_section_address_error' ) }}
		</span>
		<div
				class="has-margin-top-18"
				v-show="!addressTypeIsNotAnon">{{ $t( 'donation_addresstype_option_anonymous_disclaimer' ) }}
		</div>

		<address-forms
				:countries="countries"
				:address-validation-patterns="addressValidationPatterns"
				:is-full-selected="isFullSelected"
				:address-type="addressType">
		</address-forms>

		<div class="summary-wrapper has-margin-top-18 has-outside-border">
				<donation-summary
					:payment="paymentSummary"
					:address-type="addressTypeName"
					:address="addressSummary"
					:countries="countries"
					:language-item="inlineSummaryLanguageItem"
				/>

				<trust :assets-path="assetsPath" />
				<div class="columns payment-buttons">
					<div class="column">
						<b-button id="previous-btn" class="level-item"
								@click="previousPage"
								type="is-primary is-main"
								outlined>
							{{ $t('donation_form_section_back') }}
						</b-button>
					</div>
					<div class="column">
						<b-button id="submit-btn" :class="[ $store.getters.isValidating ? 'is-loading' : '', 'level-item' ]"
								@click="submit"
								type="is-primary is-main">
							{{ $t('donation_form_finalize') }}
						</b-button>
					</div>
				</div>
				<div class="summary-notice" v-if="isExternalPayment">{{ $t('donation_form_summary_external_payment') }}</div>
				<div class="summary-notice" v-if="isBankTransferPayment">{{ $t('donation_form_summary_bank_transfer_payment') }}</div>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { AddressTypeModel } from '@/view_models/AddressTypeModel';
import { NS_ADDRESS, NS_BANKDATA, NS_PAYMENT } from '@/store/namespaces';
import AddressType from '@/components/pages/donation_form/AddressType.vue';
import AddressForms, { AddressTypeIds } from '@/components/pages/donation_form/AddressForms.vue';
import AutofillHandler from '@/components/shared/AutofillHandler.vue';
import SubmitValues from '@/components/pages/donation_form/SubmitValues.vue';
import PaymentBankData from '@/components/shared/PaymentBankData.vue';
import PaymentSummary from '@/components/pages/donation_form/PaymentSummary.vue';
import DonationSummary from '@/components/shared/DonationSummary.vue';
import Trust from '@/components/shared/Trust.vue';
import { TrackingData } from '@/view_models/SubmitValues';
import { AddressValidation } from '@/view_models/Validation';
import { Country } from '@/view_models/Country';
import { action } from '@/store/util';
import { markEmptyValuesAsInvalid } from '@/store/bankdata/actionTypes';
import { waitForServerValidationToFinish } from '@/wait_for_server_validation';
import { discardInitialization } from '@/store/payment/actionTypes';
import { trackFormSubmission } from '@/tracking';
import { useAddressTypeFunctions } from '@/components/pages/donation_form/AddressTypeFunctions';
import { computed, ref } from '@vue/composition-api';
import { validateAddress, validateAddressType, validateEmail } from '@/store/address/actionTypes';

export default Vue.extend( {
	name: 'AddressPage',
	components: {
		AutofillHandler,
		AddressForms,
		AddressType,
		SubmitValues,
		PaymentBankData,
		PaymentSummary,
		DonationSummary,
		Trust,
	},
	props: {
		assetsPath: String,
		validateAddressUrl: String,
		validateEmailUrl: String,
		validateBankDataUrl: String,
		validateLegacyBankDataUrl: String,
		countries: Array as () => Array<Country>,
		trackingData: Object as () => TrackingData,
		addressValidationPatterns: Object as () => AddressValidation,
	},
	setup( props : any, { root: { $store }, emit } ) {
		const isFullSelected = ref( false );
		const setFullSelected = ( selected: boolean ) => {
			isFullSelected.value = selected;
		};

		const {
			disabledAddressTypes,
			addressType,
			addressTypeIsNotAnon,
			addressTypeIsInvalid,
			addressTypeName,
			setAddressType,
		} = useAddressTypeFunctions( $store );

		// Payment functions
		const isExternalPayment = computed( (): boolean => $store.getters[ NS_PAYMENT + '/isExternalPayment' ] );
		const isBankTransferPayment = computed( (): boolean => $store.getters[ NS_PAYMENT + '/isBankTransferPayment' ] );
		const isDirectDebit = computed( (): boolean => $store.getters[ NS_PAYMENT + '/isDirectDebitPayment' ] );
		const paymentWasInitialized = computed( (): boolean => $store.state[ NS_PAYMENT ].initialized );
		const paymentSummary = computed( () => {
			const payment = $store.state[ NS_PAYMENT ].values;
			return {
				interval: payment.interval,
				amount: payment.amount / 100,
				paymentType: payment.type,
			};
		} );

		// Summary functions
		const addressSummary = computed( () => ( {
			...$store.state[ NS_ADDRESS ].values,
			fullName: $store.getters[ NS_ADDRESS + '/fullName' ],
			streetAddress: $store.state[ NS_ADDRESS ].values.street,
			postalCode: $store.state[ NS_ADDRESS ].values.postcode,
			country: $store.state[ NS_ADDRESS ].values.country,
		} ) );
		const inlineSummaryLanguageItem = computed( (): string => {
			switch ( $store.state[ NS_ADDRESS ].addressType ) {
				case AddressTypeModel.ANON:
				case AddressTypeModel.UNSET:
					return 'donation_confirmation_inline_summary_anonymous';
				case AddressTypeModel.EMAIL:
					return 'donation_confirmation_inline_summary_email';
				case AddressTypeModel.COMPANY:
				case AddressTypeModel.PERSON:
				default:
					return 'donation_confirmation_inline_summary_address';
			}
		} );

		const previousPage = () => {
			$store.dispatch( action( NS_PAYMENT, discardInitialization ) );
			emit( 'previous-page' );
		};
		const submitHtmlForm = () => {
			const formId = `laika-donation-personal-data-${AddressTypeIds.get( addressType.value )}`;
			const currentAddressForm : HTMLFormElement = document.getElementById( formId ) as HTMLFormElement;
			if ( !currentAddressForm ) {
				// This should only happen if the child component has the wrong ID
				throw new Error( `Address form with ID "${formId}" not found.` );
			}

			trackFormSubmission( currentAddressForm );
			currentAddressForm.submit();
		};
		const scrollToFirstError = () => document.getElementsByClassName( 'help is-danger' )[ 0 ]
			.scrollIntoView( { behavior: 'smooth', block: 'center', inline: 'nearest' } );
		const submit = () => {
			const validationCalls = [
				$store.dispatch( action( NS_ADDRESS, validateAddressType ), $store.state.address.addressType ),
				$store.dispatch( action( NS_ADDRESS, validateAddress ), props.validateAddressUrl ),
				$store.dispatch( action( NS_ADDRESS, validateEmail ), props.validateEmailUrl ),
			];
			if ( isDirectDebit.value ) {
				validationCalls.push( $store.dispatch( action( NS_BANKDATA, markEmptyValuesAsInvalid ) ) );
			}
			Promise.all( validationCalls ).then( () => {
				// We need to wait for the asynchronous bank data validation, that might still be going on
				waitForServerValidationToFinish( $store ).then( () => {
					if ( !$store.getters[ NS_ADDRESS + '/requiredFieldsAreValid' ] ) {
						scrollToFirstError();
						return;
					}
					if ( isDirectDebit.value && !$store.getters[ NS_BANKDATA + '/bankDataIsValid' ] ) {
						scrollToFirstError();
						return;
					}
					submitHtmlForm();
				} );
			} );
		};

		return {
			// Accessors
			addressSummary,
			addressType,
			addressTypeIsNotAnon,
			addressTypeIsInvalid,
			addressTypeName,
			disabledAddressTypes,
			isFullSelected,
			isBankTransferPayment,
			isDirectDebit,
			isExternalPayment,
			inlineSummaryLanguageItem,
			paymentWasInitialized,
			paymentSummary,

			// Mutators
			setAddressType,
			setFullSelected,

			// Event handlers
			previousPage,
			submit,
		};
	},
} );
</script>
