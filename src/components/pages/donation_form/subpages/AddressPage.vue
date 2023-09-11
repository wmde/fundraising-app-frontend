<template>
	<div class="address-page">
		<h1 v-if="!paymentWasInitialized" class="title is-size-1">{{ $t( 'donation_form_section_headline' ) }}</h1>
		<payment-summary
			v-if="paymentWasInitialized"
			:amount="paymentSummary.amount"
			:payment-type="paymentSummary.paymentType"
			:interval="paymentSummary.interval"
			v-on:previous-page="previousPage">
		</payment-summary>

		<form v-if="isDirectDebitPayment" id="bank-data-details" @submit="evt => evt.preventDefault()">
			<payment-bank-data
				:validateBankDataUrl="validateBankDataUrl"
				:validateLegacyBankDataUrl="validateLegacyBankDataUrl"
			/>
		</form>

		<form id="address-type-selection" @submit="evt => evt.preventDefault()">
			<FeatureToggle>
				<template #campaigns.address_type_steps.direct>
					<address-type-basic
						v-on:address-type="setAddressType( $event )"
						v-on:set-full-selected="setFullSelected"
						:disabledAddressTypes="disabledAddressTypes"
						:is-direct-debit="isDirectDebitPayment"
						:initial-address-type="addressTypeName"
					/>
				</template>
				<template #campaigns.address_type_steps.preselect>
					<address-type-all-options
						v-on:address-type="setAddressType( $event )"
						v-on:set-full-selected="setFullSelected"
						:disabledAddressTypes="disabledAddressTypes"
						:is-direct-debit="isDirectDebitPayment"
						:initial-address-type="addressTypeName"
					/>
				</template>
				<template #campaigns.address_type_steps.full_or_email>
					<address-type-full-or-email
						v-on:address-type="setAddressType( $event )"
						v-on:set-full-selected="setFullSelected"
						:disabledAddressTypes="disabledAddressTypes"
						:is-direct-debit="isDirectDebitPayment"
						:initial-address-type="addressTypeName"
					/>
				</template>
			</FeatureToggle>
			<span
				v-if="addressTypeIsInvalid"
				class="help is-danger">{{ $t( 'donation_form_section_address_error' ) }}
			</span>
			<div
				class="has-margin-top-18"
				v-show="!addressTypeIsNotAnon">{{ $t( 'donation_addresstype_option_anonymous_disclaimer' ) }}
			</div>
		</form>

		<address-forms
			:countries="countries"
			:salutations="salutations"
			:address-validation-patterns="addressValidationPatterns"
			:is-full-selected="isFullSelected"
			:address-type="addressType"
			:tracking-data="trackingData"
			:campaign-values="campaignValues">
		</address-forms>

		<div class="summary-wrapper has-margin-top-18 has-outside-border">
			<donation-summary
				:payment="paymentSummary"
				:address-type="addressTypeName"
				:address="addressSummary"
				:countries="countries"
				:salutations="salutations"
				:language-item="inlineSummaryLanguageItem"
			/>

			<div class="columns payment-buttons">
				<div class="column">
					<FunButton
						id="previous-btn"
						class="level-item is-primary is-main is-outlined"
						@click="previousPage"
					>
						{{ $t( 'donation_form_section_back' ) }}
					</FunButton>
				</div>
				<div class="column">
					<FunDynamicSubmitButton
						id="submit-btn"
						:class="[ 'level-item is-primary is-main', { 'is-loading' : $store.getters.isValidating } ]"
						:payment-type="paymentSummary.paymentType"
						@click="submit"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { NS_ADDRESS, NS_BANKDATA, NS_PAYMENT } from '@src/store/namespaces';
import AddressTypeBasic from '@src/components/pages/donation_form/AddressTypeBasic.vue';
import AddressTypeAllOptions from '@src/components/pages/donation_form/AddressTypeAllOptions.vue';
import AddressForms, { AddressTypeIds } from '@src/components/pages/donation_form/AddressForms.vue';
import AutofillHandler from '@src/components/shared/AutofillHandler.vue';
import PaymentBankData from '@src/components/shared/PaymentBankData.vue';
import PaymentSummary from '@src/components/pages/donation_form/PaymentSummary.vue';
import DonationSummary from '@src/components/shared/DonationSummary.vue';
import { TrackingData } from '@src/view_models/TrackingData';
import { AddressValidation } from '@src/view_models/Validation';
import { Country } from '@src/view_models/Country';
import { action } from '@src/store/util';
import { markEmptyValuesAsInvalid } from '@src/store/bankdata/actionTypes';
import { waitForServerValidationToFinish } from '@src/wait_for_server_validation';
import { discardInitialization } from '@src/store/payment/actionTypes';
import { trackDynamicForm, trackFormSubmission } from '@src/tracking';
import { useAddressTypeFunctions } from '@src/components/pages/donation_form/AddressTypeFunctions';
import { validateAddress, validateAddressType, validateEmail } from '@src/store/address/actionTypes';
import { Salutation } from '@src/view_models/Salutation';
import { CampaignValues } from '@src/view_models/CampaignValues';
import { StoreKey } from '@src/store/donation_store';
import { injectStrict } from '@src/util/injectStrict';
import AddressTypeFullOrEmail from '@src/components/pages/donation_form/AddressTypeFullOrEmail.vue';
import FunButton from '@src/components/shared/form_inputs/FunButton.vue';
import FunDynamicSubmitButton from '@src/components/shared/form_inputs/FunDynamicSubmitButton.vue';

export default defineComponent( {
	name: 'AddressPage',
	components: {
		FunDynamicSubmitButton,
		FunButton,
		AddressTypeFullOrEmail,
		AutofillHandler,
		AddressForms,
		AddressTypeAllOptions,
		AddressTypeBasic,
		PaymentBankData,
		PaymentSummary,
		DonationSummary,
	},
	props: {
		assetsPath: String,
		validateAddressUrl: String,
		validateEmailUrl: String,
		validateBankDataUrl: String,
		validateLegacyBankDataUrl: String,
		countries: Array as () => Array<Country>,
		salutations: Array as () => Array<Salutation>,
		trackingData: Object as () => TrackingData,
		campaignValues: Object as () => CampaignValues,
		addressValidationPatterns: Object as () => AddressValidation,
	},
	setup( props: any, { emit } ) {
		const isFullSelected = ref( false );
		const store = injectStrict( StoreKey );
		const setFullSelected = ( selected: boolean ) => {
			isFullSelected.value = selected;
		};

		onMounted( trackDynamicForm );

		const {
			disabledAddressTypes,
			addressType,
			addressTypeIsNotAnon,
			addressTypeIsInvalid,
			addressTypeName,
			setAddressType,
		} = useAddressTypeFunctions( store );

		// Payment functions
		const isExternalPayment = computed( (): boolean => store.getters[ NS_PAYMENT + '/isExternalPayment' ] );
		const isBankTransferPayment = computed( (): boolean => store.getters[ NS_PAYMENT + '/isBankTransferPayment' ] );
		const isDirectDebitPayment = computed( (): boolean => store.getters[ NS_PAYMENT + '/isDirectDebitPayment' ] );
		const paymentWasInitialized = computed( (): boolean => store.state[ NS_PAYMENT ].initialized );
		const paymentSummary = computed( () => {
			const payment = store.state[ NS_PAYMENT ].values;
			return {
				interval: payment.interval,
				amount: payment.amount / 100,
				paymentType: payment.type,
			};
		} );

		// Summary functions
		const addressSummary = computed( () => ( {
			...store.state[ NS_ADDRESS ].values,
			fullName: store.getters[ NS_ADDRESS + '/fullName' ],
			streetAddress: store.state[ NS_ADDRESS ].values.street,
			postalCode: store.state[ NS_ADDRESS ].values.postcode,
			country: store.state[ NS_ADDRESS ].values.country,
		} ) );
		const inlineSummaryLanguageItem = computed( (): string => {
			switch ( store.state[ NS_ADDRESS ].addressType ) {
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
			store.dispatch( action( NS_PAYMENT, discardInitialization ) );
			emit( 'previous-page' );
		};
		const submitHtmlForm = () => {
			const formId = `laika-donation-personal-data-${ AddressTypeIds.get( addressType.value ) }`;
			const currentAddressForm: HTMLFormElement = document.getElementById( formId ) as HTMLFormElement;
			if ( !currentAddressForm ) {
				// This should only happen if the child component has the wrong ID
				throw new Error( `Address form with ID "${ formId }" not found.` );
			}

			trackFormSubmission( currentAddressForm );
			currentAddressForm.submit();
		};
		const scrollToFirstError = () => document.getElementsByClassName( 'help is-danger' )[ 0 ]
			.scrollIntoView( { behavior: 'smooth', block: 'center', inline: 'nearest' } );
		const submit = () => {
			const validationCalls = [
				store.dispatch( action( NS_ADDRESS, validateAddressType ), {
					type: store.state.address.addressType,
					disallowed: [ AddressTypeModel.UNSET ],
				} ),
				store.dispatch( action( NS_ADDRESS, validateAddress ), props.validateAddressUrl ),
				store.dispatch( action( NS_ADDRESS, validateEmail ), props.validateEmailUrl ),
			];
			if ( isDirectDebitPayment.value ) {
				validationCalls.push( store.dispatch( action( NS_BANKDATA, markEmptyValuesAsInvalid ) ) );
			}
			Promise.all( validationCalls ).then( () => {
				// We need to wait for the asynchronous bank data validation, that might still be going on
				waitForServerValidationToFinish( store ).then( () => {
					if ( !store.getters[ NS_ADDRESS + '/requiredFieldsAreValid' ] ) {
						scrollToFirstError();
						return;
					}
					if ( isDirectDebitPayment.value && !store.getters[ NS_BANKDATA + '/bankDataIsValid' ] ) {
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
			isDirectDebitPayment,
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
