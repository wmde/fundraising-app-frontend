<template>
	<form
		class="address-page"
		aria-live="assertive"
		aria-labelledby="membership-form-heading membership-form-subheading"
		tabindex="-1"
		ref="pageRef"
	>
		<h1 id="membership-form-heading" class="form-title">{{ $t( 'membership_form_headline' ) }}</h1>
		<h2 id="membership-form-subheading" class="form-subtitle">{{ $t( 'membership_form_address_subheading' ) }}</h2>

		<AddressFields
			:validate-address-url="validateAddressUrl.toString()"
			:validate-email-url="validateEmailUrl.toString()"
			:countries="countries"
			:salutations="salutations"
			:address-validation-patterns="addressValidationPatterns"
			:date-of-birth-validation-pattern="dateOfBirthValidationPattern"
			ref="addressFieldsRef">
		</AddressFields>

		<ErrorSummary
			:is-visible="showErrorSummary"
			:items="[
				{
					validity: store.state.membership_address.validity.salutation,
					message: $t( 'donation_form_salutation_error' ),
					focusElement: 'salutation-0',
					scrollElement: 'salutation-scroll-target'
				},
				{
					validity: store.state.membership_address.validity.firstName,
					message: $t( 'donation_form_firstname_error' ),
					focusElement: 'first-name',
					scrollElement: 'first-name-scroll-target'
				},
				{
					validity: store.state.membership_address.validity.lastName,
					message: $t( 'donation_form_lastname_error' ),
					focusElement: 'last-name',
					scrollElement: 'last-name-scroll-target'
				},
				{
					validity: store.state.membership_address.validity.street,
					message: $t( 'donation_form_street_error' ),
					focusElement: 'street',
					scrollElement: 'street-scroll-target'
				},
				{
					validity: store.state.membership_address.validity.postcode,
					message: $t( 'donation_form_zip_error' ),
					focusElement: 'post-code',
					scrollElement: 'post-code-scroll-target'
				},
				{
					validity: store.state.membership_address.validity.city,
					message: $t( 'donation_form_city_error' ),
					focusElement: 'city',
					scrollElement: 'city-scroll-target'
				},
				{
					validity: store.state.membership_address.validity.country,
					message: $t( 'donation_form_country_error' ),
					focusElement: 'country',
					scrollElement: 'country-scroll-target'
				},
				{
					validity: store.state.membership_address.validity.email,
					message: $t( 'donation_form_email_error' ),
					focusElement: 'email',
					scrollElement: 'email-scroll-target'
				},
			]"
		/>

		<FormSummary>
			<template #summary-content>
				<MembershipSummary
					:membership-application="membershipApplication"
					:address="addressSummary"
					:salutations="salutations"
					:address-is-invalid="addressIsInvalid"
					:countries="countries"
				>
					<template #title>
						<h3>{{ $t( 'membership_confirmation_thanks_text' ) }}</h3>
					</template>
				</MembershipSummary>
			</template>

			<template #summary-buttons>
				<FormButton
					id="previous-btn"
					:is-outlined="true"
					@click="previousPage"
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
			</template>
		</FormSummary>
	</form>

	<form action="/apply-for-membership" method="post" ref="submitValuesForm" id="submit-form">
		<SubmitValues :campaign-values="campaignValues" :tracking-data="trackingData"/>
	</form>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import MembershipSummary from '@src/components/shared/MembershipSummary.vue';
import AddressFields from '@src/components/pages/membership_form/Address.vue';
import SubmitValues from '@src/components/pages/membership_form/SubmitValues.vue';
import { AddressValidation } from '@src/view_models/Validation';
import { Salutation } from '@src/view_models/Salutation';
import { membershipTypeName } from '@src/view_models/MembershipTypeModel';
import { addressTypeName } from '@src/view_models/AddressTypeModel';
import { Country } from '@src/view_models/Country';
import { CampaignValues } from '@src/view_models/CampaignValues';
import { TrackingData } from '@src/view_models/TrackingData';
import { useStore } from 'vuex';
import { useAddressFormEventHandlers } from '@src/components/pages/membership_form/useAddressFormEventHandlers';
import { trackFormSubmission } from '@src/util/tracking';
import FormButton from '@src/components/shared/form_elements/FormButton.vue';
import FormSummary from '@src/components/shared/FormSummary.vue';
import { MembershipApplication } from '@src/Domain/Membership/MembershipApplication';
import { MembershipAddress } from '@src/Domain/Membership/MembershipAddress';
import ErrorSummary from '@src/components/shared/validation_summary/ErrorSummary.vue';

interface Props {
	validateAddressUrl: String;
	validateEmailUrl: String;
	countries: Country[];
	salutations: Salutation[];
	addressValidationPatterns: AddressValidation;
	dateOfBirthValidationPattern: String;
	campaignValues: CampaignValues;
	trackingData: TrackingData;
}

const props = defineProps<Props>();
const emit = defineEmits( [ 'previous-page', 'submit-membership' ] );
const store = useStore();
const pageRef = ref<HTMLElement>( null );
defineExpose( { focus: (): void => pageRef.value.focus() } );
const addressFieldsRef = ref<HTMLFormElement>();
const addressIsInvalid = computed( (): boolean => !store.getters[ 'membership_address/requiredFieldsAreValid' ] );

const membershipApplication = computed( (): MembershipApplication => {
	const payment = store.state.membership_fee.values;
	return {
		paymentIntervalInMonths: payment.interval,
		membershipFee: payment.fee / 100,
		paymentType: payment.type,
		membershipType: membershipTypeName( store.getters[ 'membership_address/membershipType' ] ),
		incentives: [],
	};
} );

const isDirectDebitPayment = computed( (): boolean => store.state.membership_fee.values.type === 'BEZ' );

const addressSummary = computed( (): MembershipAddress => {
	return {
		...store.state.membership_address.values,
		fullName: store.getters[ 'membership_address/fullName' ],
		streetAddress: store.state.membership_address.values.street,
		postalCode: store.state.membership_address.values.postcode,
		countryCode: store.state.membership_address.values.country,
		applicantType: addressTypeName( store.getters[ 'membership_address/addressType' ] ),
	};
} );

const trackAddressForm = () => {
	trackFormSubmission( addressFieldsRef.value );
};

const { submit, previousPage, submitValuesForm, showErrorSummary } = useAddressFormEventHandlers(
	store,
	emit,
	isDirectDebitPayment,
	props.validateAddressUrl.toString(),
	props.validateEmailUrl.toString(),
	trackAddressForm,
);

</script>
