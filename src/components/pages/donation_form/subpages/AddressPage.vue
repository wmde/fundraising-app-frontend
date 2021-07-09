<template>
	<form name="laika-donation-personal-data"
			id="laika-donation-personal-data"
			class="address-page"
			ref="personal"
			action="/donation/add"
			method="post">
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
				:is-full-selected="isFullSelected"
		/>
		<span
				v-if="addressTypeIsInvalid"
				class="help is-danger">{{ $t( 'donation_form_section_address_error' ) }}
		</span>
		<div
				class="has-margin-top-18"
				v-show="!addressTypeIsNotAnon">{{ $t( 'donation_addresstype_option_anonymous_disclaimer' ) }}
		</div>

		<address-fields
				:validate-address-url="validateAddressUrl"
				:validate-email-url="validateEmailUrl"
				:countries="countries"
				:address-validation-patterns="addressValidationPatterns"
				ref="address">
		</address-fields>

		<div class="summary-wrapper has-margin-top-18 has-outside-border">
				<donation-summary
					:payment="paymentSummary"
					:address-type="addressTypeName"
					:address="addressSummary"
					:countries="countries"
					:language-item="inlineSummaryLanguageItem"
				/>

				<trust :assets-path="assetsPath" />
				<submit-values :tracking-data="{}"></submit-values>
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
	</form>
</template>

<script lang="ts">
import Vue from 'vue';
import { AddressTypeModel } from '@/view_models/AddressTypeModel';
import { NS_ADDRESS, NS_BANKDATA, NS_PAYMENT } from '@/store/namespaces';
import AddressType from '@/components/pages/donation_form/AddressType.vue';
import AddressFields from '@/components/pages/donation_form/Address.vue';
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
import { ref } from '@vue/composition-api';

export default Vue.extend( {
	name: 'AddressPage',
	components: {
		AutofillHandler,
		AddressFields,
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
	setup( props : any, { root: { $store } } ) {
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

		return {
			isFullSelected,
			disabledAddressTypes,
			addressType,
			addressTypeIsNotAnon,
			addressTypeIsInvalid,
			addressTypeName,

			setAddressType,
			setFullSelected,
		};
	},
	computed: {
		paymentSummary: {
			get(): object {
				const payment = this.$store.state[ NS_PAYMENT ].values;
				return {
					interval: payment.interval,
					amount: payment.amount / 100,
					paymentType: payment.type,
				};
			},
		},
		addressSummary: {
			get(): object {
				return {
					...this.$store.state[ NS_ADDRESS ].values,
					fullName: this.$store.getters[ NS_ADDRESS + '/fullName' ],
					streetAddress: this.$store.state[ NS_ADDRESS ].values.street,
					postalCode: this.$store.state[ NS_ADDRESS ].values.postcode,
					country: this.$store.state[ NS_ADDRESS ].values.country,
				};
			},
		},
		isExternalPayment: {
			get(): boolean {
				return this.$store.getters[ NS_PAYMENT + '/isExternalPayment' ];
			},
		},
		isBankTransferPayment: {
			get(): boolean {
				return this.$store.getters[ NS_PAYMENT + '/isBankTransferPayment' ];
			},
		},
		paymentWasInitialized: {
			get(): boolean {
				return this.$store.state[ NS_PAYMENT ].initialized;
			},
		},
		isDirectDebit: {
			get: function (): boolean {
				return this.$store.getters[ 'payment/isDirectDebitPayment' ];
			},
		},
		inlineSummaryLanguageItem(): string {
			switch ( this.$store.state[ NS_ADDRESS ].addressType ) {
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
		},
	},
	methods: {
		previousPage() {
			this.$store.dispatch( action( NS_PAYMENT, discardInitialization ) );
			this.$emit( 'previous-page' );
		},
		submit() {
			const validationCalls = [
				( this.$refs.address as any ).validateForm(),
			];
			if ( this.$store.getters[ NS_PAYMENT + '/isDirectDebitPayment' ] ) {
				validationCalls.push( this.$store.dispatch( action( NS_BANKDATA, markEmptyValuesAsInvalid ) ) );
			}
			Promise.all( validationCalls ).then( () => {
				// We need to wait for the asynchronous bank data validation, that might still be going on
				waitForServerValidationToFinish( this.$store ).then( () => {
					if ( this.$store.getters[ NS_ADDRESS + '/requiredFieldsAreValid' ] ) {
						if ( this.$store.getters[ NS_PAYMENT + '/isDirectDebitPayment' ] &&
							!this.$store.getters[ NS_BANKDATA + '/bankDataIsValid' ] ) {
							document.getElementsByClassName( 'help is-danger' )[ 0 ].scrollIntoView( { behavior: 'smooth', block: 'center', inline: 'nearest' } );
							return;
						}
						( this as any ).submitDonationForm();
					} else {
						document.getElementsByClassName( 'help is-danger' )[ 0 ].scrollIntoView( { behavior: 'smooth', block: 'center', inline: 'nearest' } );
					}
				} );
			} );
		},
		submitDonationForm(): void {
			const formPersonal = this.$refs.personal as HTMLFormElement;
			trackFormSubmission( formPersonal );
			formPersonal.submit();
		},
	},
} );
</script>
