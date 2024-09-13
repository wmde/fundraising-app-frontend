<template>
	<div
		id="donation-page-form-section-personal-data"
		class="donation-page-form-section"
		aria-live="assertive"
		aria-labelledby="donation-form-subheading donation-form-tagline"
	>
		<h2 id="donation-form-subheading" class="form-subtitle">{{ $t( 'donation_form_address_subheading' ) }}</h2>
		<p id="donation-form-tagline">{{ $t( 'donation_form_section_address_tagline' ) }}</p>

		<form v-if="isDirectDebitPayment" id="bank-data-details" @submit="evt => evt.preventDefault()">
			<h2 v-if="isDirectDebitPayment" id="donation-form-subheading" class="form-subtitle">{{ $t( 'donation_form_payment_bankdata_title' ) }}</h2>
			<BankFields/>
		</form>

		<form id="address-type-selection" @submit="evt => evt.preventDefault()">
			<ScrollTarget target-id="address-type-scroll-target"/>
			<AddressTypeBasic
				@address-type="setAddressType( $event )"
				@set-full-selected="setFullSelected"
				:disabledAddressTypes="disabledAddressTypes"
				:is-direct-debit="isDirectDebitPayment"
				:initial-address-type="addressType"
				:address-type-is-invalid="addressTypeIsInvalid"
			/>
			<div
				class="address-type-anonymous-disclaimer"
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

		<FeatureToggle default-template="campaigns.address_field_order.legacy">
			<template #campaigns.address_field_order.legacy>
				<SinglePageErrorSummary :show-error-summary="showErrorSummary" :address-type="addressType"/>
			</template>

			<template #campaigns.address_field_order.new_order>
				<StreetAutocompleteSinglePageErrorSummaries :show-error-summary="showErrorSummary" :address-type="addressType"/>
			</template>
		</FeatureToggle>

		<FormSummary>
			<template #summary-content>
				<DonationSummary
					:payment="paymentSummary"
					:address-type="addressTypeName"
					:address="addressSummary"
					:countries="countries"
					:salutations="salutations"
					:language-item="inlineSummaryLanguageItem"
				/>
			</template>

			<template #summary-buttons>
				<FormButton
					id="previous-btn"
					:is-outlined="true"
					@click="scrollToPaymentSection()"
				>
					{{ $t( 'donation_form_section_back' ) }}
				</FormButton>
				<PaymentTextFormButton
					id="submit-btn"
					:is-loading="store.getters.isValidating"
					:payment-type="paymentSummary.paymentType"
					@click="submit"
				/>
			</template>

		</FormSummary>
		<form :action="`/donation/add?${campaignParams}`" method="post" ref="submitValuesForm" id="submit-form">
			<SubmitValues :tracking-data="trackingData" :campaign-values="campaignValues"/>
		</form>
	</div>
</template>

<script setup lang="ts">
import { inject, onMounted, ref } from 'vue';
import ScrollTarget from '@src/components/shared/ScrollTarget.vue';
import AddressTypeBasic from '@src/components/pages/donation_form/AddressTypeBasic.vue';
import DonationSummary from '@src/components/pages/donation_form/DonationSummary.vue';
import AddressForms from '@src/components/pages/donation_form/AddressForms.vue';
import SubmitValues from '@src/components/pages/donation_form/SubmitValues.vue';
import PaymentTextFormButton from '@src/components/shared/form_elements/PaymentTextFormButton.vue';
import FormButton from '@src/components/shared/form_elements/FormButton.vue';
import FormSummary from '@src/components/shared/FormSummary.vue';
import { CampaignValues } from '@src/view_models/CampaignValues';
import { Country } from '@src/view_models/Country';
import { Salutation } from '@src/view_models/Salutation';
import { TrackingData } from '@src/view_models/TrackingData';
import { trackDynamicForm } from '@src/util/tracking';
import {
	usePersonalDataSectionEventHandlers,
} from '@src/components/pages/donation_form/usePersonalDataSectionEventHandlers';
import { useAddressSummary } from '@src/components/pages/donation_form/useAddressSummary';
import { useAddressTypeFunctions } from '@src/components/pages/donation_form/AddressTypeFunctions';
import { usePaymentFunctions } from '@src/components/pages/donation_form/usePaymentFunctions';
import { AddressValidation } from '@src/view_models/Validation';
import { QUERY_STRING_INJECTION_KEY } from '@src/util/createCampaignQueryString';
import { useStore } from 'vuex';
import SinglePageErrorSummary
	from '@src/components/pages/donation_form/singlePageFromSections/SinglePageErrorSummary.vue';
import StreetAutocompleteSinglePageErrorSummaries
	from '@src/components/pages/donation_form/StreetAutocomplete/SinglePageErrorSummary.vue';
import BankFields from '@src/components/shared/BankFields.vue';

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
const campaignParams = inject<string>( QUERY_STRING_INJECTION_KEY, '' );
const isFullSelected = ref( false );
const store = useStore();
defineExpose( { focus: (): void => pageRef.value.focus() } );

const setFullSelected = ( selected: boolean ) => {
	isFullSelected.value = selected;
};

const scrollToPaymentSection = () => {
	const scrollIntoViewElement = document.getElementById( 'donation-page-form-section-payment' );
	if ( scrollIntoViewElement ) {
		scrollIntoViewElement.scrollIntoView( { behavior: 'smooth' } );
	}
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
	isDirectDebitPayment,
	paymentSummary,
} = usePaymentFunctions( store );

const {
	addressSummary,
	inlineSummaryLanguageItem,
} = useAddressSummary( store );

const { submit, submitValuesForm, showErrorSummary } = usePersonalDataSectionEventHandlers(
	store,
	addressType,
	isDirectDebitPayment,
	props.validateAddressUrl,
	props.validateEmailUrl
);

</script>

<style lang="scss">
@use '@src/scss/settings/units';
@use 'sass:map';

.address-type-anonymous-disclaimer {
	margin-top: map.get( units.$spacing, 'medium' );
}
</style>
