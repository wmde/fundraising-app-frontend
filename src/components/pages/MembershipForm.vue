<template>
	<form action="" @submit.prevent>

		<FeatureToggle default-template="campaigns.membership_form.legacy">
			<template #campaigns.membership_form.test_01_more_info>
				<ContentCard :is-collapsable="true" :is-flow="false">
					<template #content>
						<DetailedInfoBox id="membership-benefits-info-box">
							<template #heading >
								<GlobeIcon class="highlighted-icon"/>
								<h2 class="highlighted-content-text">{{ $t('membership_form_detailed_info_box_heading') }}</h2>
							</template>

							<template #collapsed-content >
								<p>
									{{ $t('membership_form_detailed_info_box_collapsed_info_text') }}
								</p>
								<div class="cluster info-columns">
									<div class="flow">
										<div class="info-columns__icon">
											<SoftwareTechnologyIcon class="highlighted-icon"/>
										</div>
										<p><strong>{{ $t('membership_form_detailed_info_box_category_1') }}</strong><br>
											{{ $t('membership_form_detailed_info_box_category_1_headline') }}</p>
									</div>
									<div class="flow">
										<div class="info-columns__icon">
											<ShieldIcon class="highlighted-icon"/>
										</div>
										<p><strong>{{ $t('membership_form_detailed_info_box_category_2') }}</strong><br>
											{{ $t('membership_form_detailed_info_box_category_2_headline') }}</p>
									</div>
									<div class="flow">
										<div class="info-columns__icon">
											<BooksIcon class="highlighted-icon"/>
										</div>
										<p><strong>{{ $t('membership_form_detailed_info_box_category_3') }}</strong><br>
											{{ $t('membership_form_detailed_info_box_category_3_headline') }}</p>
									</div>
								</div>
							</template>
							<template #expanded-content>
								<p>
									{{ $t('membership_form_detailed_info_box_expanded_info_text') }}
								</p>

								<div class="sidebar icon-sidebar">
									<div><SoftwareTechnologyIcon class="highlighted-icon"/></div>
									<div>
										<p><strong>{{ $t('membership_form_detailed_info_box_category_1') }}</strong>
											{{ $t('membership_form_detailed_info_box_category_1_headline') }}</p>
										<p>{{ $t('membership_form_detailed_info_box_category_1_text_expanded') }}</p>
									</div>
								</div>

								<div class="sidebar icon-sidebar">
									<div><ShieldIcon class="highlighted-icon"/></div>
									<div>
										<p><strong>{{ $t('membership_form_detailed_info_box_category_2') }}</strong>
											{{ $t('membership_form_detailed_info_box_category_2_headline') }}</p>
										<p>{{ $t('membership_form_detailed_info_box_category_2_text_expanded') }}</p>
									</div>
								</div>

								<div class="sidebar icon-sidebar">
									<div><BooksIcon class="highlighted-icon"/></div>
									<div>
										<p><strong>{{ $t('membership_form_detailed_info_box_category_3') }}</strong>
											{{ $t('membership_form_detailed_info_box_category_3_headline') }}</p>
										<p>{{ $t('membership_form_detailed_info_box_category_3_text_expanded') }}</p>
									</div>
								</div>
							</template>
						</DetailedInfoBox>

						<div class="content-card__content">
							<div class="callout flow" data-borderless>
								<h3>{{ $t( 'membership_form_reasons_title' ) }}</h3>
								<ul class="icon-list">
									<li class="icon-text">
										<span class="icon-text__icon"><TickIcon class="highlighted-icon"/></span>
										<span>{{ $t( 'membership_form_reasons_01' ) }}</span>
									</li>
									<li class="icon-text">
										<span class="icon-text__icon"><TickIcon class="highlighted-icon"/></span>
										<span>{{ $t( 'membership_form_reasons_02' ) }}</span>
									</li>
									<li class="icon-text">
										<span class="icon-text__icon"><TickIcon class="highlighted-icon"/></span>
										<span>{{ $t( 'membership_form_reasons_03' ) }}</span>
									</li>
									<li class="icon-text">
										<span class="icon-text__icon"><TickIcon class="highlighted-icon"/></span>
										<span>{{ $t( 'membership_form_reasons_04' ) }}</span>
									</li>
									<li class="icon-text">
										<span class="icon-text__icon"><TickIcon class="highlighted-icon"/></span>
										<span>{{ $t( 'membership_form_reasons_05' ) }}</span>
									</li>
									<li class="icon-text">
										<span class="icon-text__icon"><TickIcon class="highlighted-icon"/></span>
										<span>{{ $t( 'membership_form_reasons_06' ) }}</span>
									</li>
								</ul>
							</div>
						</div>
					</template>
				</ContentCard>
			</template>
		</FeatureToggle>

		<ContentCard>
			<template #heading>
				<h1 id="membership-form-heading">{{ $t( 'membership_form_headline' ) }}</h1>
				<h2 id="membership-form-subheading">{{ $t( 'membership_form_payment_subheading' ) }}</h2>
			</template>

			<template #content>
				<ErrorSummary
					:is-visible="showErrorSummary"
					:items="[
						{
							validity: store.state.membership_fee.validity.interval,
							message: $t( 'error_summary_interval' ),
							focusElement: 'interval-0',
							scrollElement: 'payment-form-interval',
						},
						{
							validity: store.state.membership_fee.validity.fee,
							message: $t( 'error_summary_amount' ),
							focusElement: 'amount-500',
							scrollElement: 'payment-form-amount',
						},
						{
							validity: store.state.bankdata.validity.iban,
							message: $t( 'donation_form_payment_iban_error' ),
							focusElement: 'iban',
							scrollElement: 'payment-form-iban',
						},
						{
							validity: store.state.membership_address.validity.salutation,
							message: $t( 'donation_form_salutation_error' ),
							focusElement: 'salutation-0',
							scrollElement: 'address-form-salutation',
						},
						{
							validity: store.state.membership_address.validity.firstName,
							message: $t( 'donation_form_firstname_error' ),
							focusElement: 'first-name',
							scrollElement: 'address-form-first-name',
						},
						{
							validity: store.state.membership_address.validity.lastName,
							message: $t( 'donation_form_lastname_error' ),
							focusElement: 'last-name',
							scrollElement: 'address-form-last-name',
						},
						{
							validity: store.state.membership_address.validity.street,
							message: $t( 'donation_form_street_error' ),
							focusElement: 'street',
							scrollElement: 'address-form-street',
						},
						{
							validity: store.state.membership_address.validity.postcode,
							message: $t( 'donation_form_zip_error' ),
							focusElement: 'post-code',
							scrollElement: 'address-form-post-code',
						},
						{
							validity: store.state.membership_address.validity.city,
							message: $t( 'donation_form_city_error' ),
							focusElement: 'city',
							scrollElement: 'address-form-city',
						},
						{
							validity: store.state.membership_address.validity.country,
							message: $t( 'donation_form_country_error' ),
							focusElement: 'country',
							scrollElement: 'address-form-country',
						},
						{
							validity: store.state.membership_address.validity.date,
							message: $t( 'membership_form_birth_date_error' ),
							focusElement: 'date',
							scrollElement: 'address-form-date-of-birth',
						},
						{
							validity: store.state.membership_address.validity.email,
							message: $t( 'donation_form_email_error' ),
							focusElement: 'email',
							scrollElement: 'address-form-email',
						},
					]"
				/>

				<MembershipTypeField
					v-if="showMembershipTypeOption"
					v-model="membershipTypeModel"
					:disabledMembershipTypes="disabledMembershipTypes"
					:is-max-width-field="true"
				/>

				<AddressType
					@field-changed="setAddressType( $event )"
					:disabledAddressTypes="disabledAddressTypes"
					:is-direct-debit="isDirectDebitPayment"
					:initial-address-type="addressType"
					:address-type-is-invalid="false"
					:is-max-width-field="true"
				/>

				<Payment
					:payment-amounts="paymentAmounts"
					:payment-intervals="paymentIntervals"
					:payment-types="paymentTypes"
					:validate-fee-url="validateFeeUrl.toString()"
					:validate-bank-data-url="validateBankDataUrl.toString()"
					:validate-legacy-bank-data-url="validateLegacyBankDataUrl.toString()"
				/>
			</template>
		</ContentCard>

		<ContentCard>
			<template #heading>
				<h2 id="membership-form-subheading">{{ $t( 'membership_form_address_subheading' ) }}</h2>
			</template>

			<template #content>
				<AddressFields
					:validate-address-url="validateAddressUrl.toString()"
					:validate-email-url="validateEmailUrl.toString()"
					:countries="countries"
					:salutations="salutations"
					:address-validation-patterns="addressValidationPatterns"
					:date-of-birth-validation-pattern="dateOfBirthValidationPattern"
					ref="addressFieldsRef">
				</AddressFields>
			</template>
		</ContentCard>

		<ContentCard>

				<template #heading v-if="paymentSummary || addressSummary || bankDataSummary">
					<h2 aria-live="polite">{{ $t( 'form_summary_title' ) }}</h2>
					<MembershipSummaryHeadline v-if="paymentSummary" :paymentSummary="paymentSummary"/>
				</template>

				<template #content>
					<Summary v-if="addressSummary || bankDataSummary">
						<template #left v-if="addressSummary">
							<AddressSummarySection
								:address="addressSummary"
								:countries="countries"
								:salutations="salutations"
							/>
						</template>
						<template #right v-if="bankDataSummary">
							<PaymentSummarySection
								:bank-data="bankDataSummary"
							/>
						</template>
					</Summary>

					<div class="switcher">
						<FormButton
							id="previous-btn"
							:is-outlined="true"
							@click="scrollToPaymentSection"
						>
							{{ $t('membership_form_section_back') }}
						</FormButton>
						<FormButton
							id="submit-btn"
							:is-loading="store.getters.isValidating"
							@click="submit"
						>
							{{ $t('membership_form_finalize') }}
						</FormButton>
					</div>
				</template>
			</ContentCard>
		</form>

	<form action="/apply-for-membership" method="post" ref="submitValuesForm" id="submit-form">
		<SubmitValues :campaign-values="campaignValues" :tracking-data="trackingData"/>
	</form>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Country } from '@src/view_models/Country';
import type { CampaignValues } from '@src/view_models/CampaignValues';
import type { AddressValidation } from '@src/view_models/Validation';
import type { TrackingData } from '@src/view_models/TrackingData';
import type { Salutation } from '@src/view_models/Salutation';
import ContentCard from '@src/components/patterns/ContentCard.vue';
import Payment from '@src/components/pages/membership_form/Payment.vue';
import ErrorSummary from '@src/components/shared/ErrorSummary.vue';
import MembershipTypeField from '@src/components/pages/membership_form/MembershipTypeField.vue';
import AddressType from '@src/components/pages/membership_form/AddressType.vue';
import { useStore } from 'vuex';
import { useAddressTypeFunctions } from '@src/components/pages/membership_form/AddressTypeFunctions';
import { useMembershipTypeModel } from '@src/components/pages/membership_form/useMembershipTypeModel';
import { MembershipTypeModel } from '@src/view_models/MembershipTypeModel';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { useMembershipFormSubmitHandler } from '@src/components/pages/membership_form/useMembershipFormSubmitHandler';
import { trackFormSubmission } from '@src/util/tracking';
import AddressFields from '@src/components/pages/membership_form/Address.vue';
import FormButton from '@src/components/shared/form_elements/FormButton.vue';
import SubmitValues from '@src/components/pages/membership_form/SubmitValues.vue';
import MembershipSummaryHeadline from '@src/components/pages/membership_form/MembershipSummaryHeadline.vue';
import Summary from '@src/components/patterns/Summary.vue';
import AddressSummarySection from '@src/components/shared/AddressSummarySection.vue';
import PaymentSummarySection from '@src/components/shared/PaymentSummarySection.vue';
import { useMembershipBankDataSummary } from '@src/components/pages/membership_form/useMembershipBankDataSummary';
import { useMembershipPaymentFunctions } from '@src/components/pages/membership_form/useMembershipPaymentFunctions';
import TickIcon from '@src/components/shared/icons/TickIcon.vue';
import DetailedInfoBox from '@src/components/patterns/DetailedInfoBox.vue';
import GlobeIcon from '@src/components/shared/icons/GlobeIcon.vue';
import BooksIcon from '@src/components/shared/icons/BooksIcon.vue';
import ShieldIcon from '@src/components/shared/icons/ShieldIcon.vue';
import SoftwareTechnologyIcon from '@src/components/shared/icons/SoftwareTechnologyIcon.vue';

interface Props {
	validateAddressUrl: string;
	validateEmailUrl: string;
	validateBankDataUrl: string;
	validateLegacyBankDataUrl: string;
	validateFeeUrl: string;
	paymentAmounts: number[];
	paymentIntervals: number[];
	paymentTypes: string[];
	countries: Country[];
	salutations: Salutation[];
	showMembershipTypeOption: Boolean;
	addressValidationPatterns: AddressValidation;
	dateOfBirthValidationPattern: String;
	campaignValues: CampaignValues;
	trackingData: TrackingData;
}

const props = defineProps<Props>();
const store = useStore();

const addressFieldsRef = ref<HTMLFormElement>();
const { disabledAddressTypes, addressType, setAddressType, addressSummary } = useAddressTypeFunctions( store );
const { bankDataSummary } = useMembershipBankDataSummary( store );
const { paymentSummary } = useMembershipPaymentFunctions( store );
const membershipTypeModel = useMembershipTypeModel( store );
const disabledMembershipTypes = computed(
	(): MembershipTypeModel[] => {
		return store.state.membership_address.addressType === AddressTypeModel.COMPANY ? [ MembershipTypeModel.ACTIVE ] : [];
	}
);
const trackAddressForm = () => {
	trackFormSubmission( addressFieldsRef.value );
};
const isDirectDebitPayment = computed( (): boolean => store.state.membership_fee.values.type === 'BEZ' );

const {
	submit,
	submitValuesForm,
	showErrorSummary,
} = useMembershipFormSubmitHandler( store, isDirectDebitPayment, props.validateAddressUrl, props.validateEmailUrl, trackAddressForm );

const scrollToPaymentSection = () => {
	const scrollIntoViewElement = document.getElementById( 'membership-form-heading' );
	if ( scrollIntoViewElement ) {
		scrollIntoViewElement.scrollIntoView( { behavior: 'auto' } );
	}
};

</script>
