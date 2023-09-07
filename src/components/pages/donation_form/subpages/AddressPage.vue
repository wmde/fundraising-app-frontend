<template>
	<div class="address-page">
		<h1 v-if="!paymentWasInitialized" class="title is-size-1">{{ $t( 'donation_form_section_headline' ) }}</h1>
		<PaymentSummary
			v-if="paymentWasInitialized"
			:amount="paymentSummary.amount"
			:payment-type="paymentSummary.paymentType"
			:interval="paymentSummary.interval"
			@previous-page="previousPage">
		</PaymentSummary>

		<form v-if="isDirectDebit" id="bank-data-details" @submit="evt => evt.preventDefault()">
			<PaymentBankData
				:validateBankDataUrl="validateBankDataUrl"
				:validateLegacyBankDataUrl="validateLegacyBankDataUrl"
			/>
		</form>

		<form id="address-type-selection" @submit="evt => evt.preventDefault()">
			<FeatureToggle>
				<template #campaigns.address_type_steps.direct>
					<AddressTypeBasic
						@address-type="setAddressType( $event )"
						@set-full-selected="setFullSelected"
						:disabledAddressTypes="disabledAddressTypes"
						:is-direct-debit="isDirectDebit"
						:initial-address-type="addressTypeName"
					/>
				</template>
				<template #campaigns.address_type_steps.preselect>
					<AddressTypeAllOptions
						@address-type="setAddressType( $event )"
						@set-full-selected="setFullSelected"
						:disabledAddressTypes="disabledAddressTypes"
						:is-direct-debit="isDirectDebit"
						:initial-address-type="addressTypeName"
					/>
				</template>
				<template #campaigns.address_type_steps.full_or_email>
					<AddressTypeFullOrEmail
						@address-type="setAddressType( $event )"
						@set-full-selected="setFullSelected"
						:disabledAddressTypes="disabledAddressTypes"
						:is-direct-debit="isDirectDebit"
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

		<AddressForms
			:countries="countries"
			:salutations="salutations"
			:address-validation-patterns="addressValidationPatterns"
			:is-full-selected="isFullSelected"
			:address-type="addressType"
			:tracking-data="trackingData"
			:campaign-values="campaignValues">
		</AddressForms>

		<div class="summary-wrapper has-margin-top-18 has-outside-border">
			<DonationSummary
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
					<FunButton
						id="submit-btn"
						:class="[ 'level-item is-primary is-main', { 'is-loading' : $store.getters.isValidating } ]"
						@click="submit">
						{{ $t( 'donation_form_finalize' ) }}
					</FunButton>
				</div>
			</div>
			<div class="summary-notice" v-if="isExternalPayment">
				{{ $t( 'donation_form_summary_external_payment' ) }}
			</div>
			<div class="summary-notice" v-if="isBankTransferPayment">
				{{ $t( 'donation_form_summary_bank_transfer_payment' ) }}
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AddressForms from '@src/components/pages/donation_form/AddressForms.vue';
import AddressTypeAllOptions from '@src/components/pages/donation_form/AddressTypeAllOptions.vue';
import AddressTypeBasic from '@src/components/pages/donation_form/AddressTypeBasic.vue';
import AddressTypeFullOrEmail from '@src/components/pages/donation_form/AddressTypeFullOrEmail.vue';
import DonationSummary from '@src/components/shared/DonationSummary.vue';
import FunButton from '@src/components/shared/form_inputs/FunButton.vue';
import PaymentBankData from '@src/components/shared/PaymentBankData.vue';
import PaymentSummary from '@src/components/pages/donation_form/PaymentSummary.vue';
import { AddressValidation } from '@src/view_models/Validation';
import { CampaignValues } from '@src/view_models/CampaignValues';
import { Country } from '@src/view_models/Country';
import { Salutation } from '@src/view_models/Salutation';
import { StoreKey } from '@src/store/donation_store';
import { TrackingData } from '@src/view_models/TrackingData';
import { injectStrict } from '@src/util/injectStrict';
import { trackDynamicForm } from '@src/tracking';
import { useAddressFormEventHandlers } from '@src/components/pages/donation_form/useAddressFormEventHandlers';
import { useAddressSummary } from '@src/components/pages/donation_form/useAddressSummary';
import { useAddressTypeFunctions } from '@src/components/pages/donation_form/AddressTypeFunctions';
import { usePaymentFunctions } from '@src/components/pages/donation_form/usePaymentFunctions';

interface Props {
	assetsPath: string;
	validateAddressUrl: string;
	validateEmailUrl: string;
	validateBankDataUrl: string;
	validateLegacyBankDataUrl: string;
	countries: Country[];
	salutations: Salutation[];
	trackingData: TrackingData;
	campaignValues: CampaignValues;
	addressValidationPatterns: AddressValidation;
}

const props = defineProps<Props>();
const emit = defineEmits( [ 'previous-page' ] );

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

const {
	isBankTransferPayment,
	isDirectDebit,
	isExternalPayment,
	paymentSummary,
	paymentWasInitialized,
} = usePaymentFunctions( store );

const {
	addressSummary,
	inlineSummaryLanguageItem,
} = useAddressSummary( store );

const { submit, previousPage } = useAddressFormEventHandlers( store, emit, addressType, isDirectDebit, props.validateAddressUrl, props.validateEmailUrl );

</script>
