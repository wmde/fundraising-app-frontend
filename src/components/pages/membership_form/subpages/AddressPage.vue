<template>
	<div class="address-page">
		<h1 class="title is-size-5">{{ $t( 'membership_form_section_address_title' ) }}</h1>
		<AddressFields
			:validate-address-url="validateAddressUrl.toString()"
			:validate-email-url="validateEmailUrl.toString()"
			:countries="countries"
			:salutations="salutations"
			:address-validation-patterns="addressValidationPatterns"
			:date-of-birth-validation-pattern="dateOfBirthValidationPattern"
			ref="addressFieldsRef">
		</AddressFields>

		<FormSummary>
			<template #summary-content>
				<MembershipSummary
					:membership-application="membershipApplication"
					:address="addressSummary"
					:salutations="salutations"
					:address-is-invalid="addressIsInvalid">
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

		<form action="/apply-for-membership" method="post" ref="submitValuesForm">
			<SubmitValues/>
		</form>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import MembershipSummary from '@src/components/shared/MembershipSummary.vue';
import AddressFields from '@src/components/pages/membership_form/Address.vue';
import SubmitValues from '@src/components/pages/membership_form/SubmitValues.vue';
import { NS_MEMBERSHIP_ADDRESS, NS_MEMBERSHIP_FEE } from '@src/store/namespaces';
import { AddressValidation } from '@src/view_models/Validation';
import { Salutation } from '@src/view_models/Salutation';
import { membershipTypeName } from '@src/view_models/MembershipTypeModel';
import { addressTypeName } from '@src/view_models/AddressTypeModel';
import { Country } from '@src/view_models/Country';
import { useStore } from 'vuex';
import { useAddressFormEventHandlers } from '@src/components/pages/membership_form/useAddressFormEventHandlers';
import { trackFormSubmission } from '@src/util/tracking';
import FormButton from '@src/components/shared/form_elements/FormButton.vue';
import FormSummary from '@src/components/shared/FormSummary.vue';

interface Props {
	validateAddressUrl: String;
	validateEmailUrl: String;
	countries: Country[];
	salutations: Salutation[];
	addressValidationPatterns: AddressValidation;
	dateOfBirthValidationPattern: String;
}

const props = defineProps<Props>();
const emit = defineEmits( [ 'previous-page', 'submit-membership' ] );
const store = useStore();

const addressFieldsRef = ref<HTMLFormElement>();
const addressIsInvalid = computed( (): boolean => !store.getters[ NS_MEMBERSHIP_ADDRESS + '/requiredFieldsAreValid' ] );

const membershipApplication = computed( (): object => {
	const payment = store.state[ NS_MEMBERSHIP_FEE ].values;
	return {
		paymentIntervalInMonths: payment.interval,
		membershipFee: payment.fee / 100,
		paymentType: payment.type,
		membershipType: membershipTypeName( store.getters[ NS_MEMBERSHIP_ADDRESS + '/membershipType' ] ),
	};
} );

const isDirectDebitPayment = computed( (): boolean => store.state[ NS_MEMBERSHIP_FEE ].values.type === 'BEZ' );

const addressSummary = computed( (): object => {
	return {
		...store.state[ NS_MEMBERSHIP_ADDRESS ].values,
		fullName: store.getters[ NS_MEMBERSHIP_ADDRESS + '/fullName' ],
		streetAddress: store.state[ NS_MEMBERSHIP_ADDRESS ].values.street,
		postalCode: store.state[ NS_MEMBERSHIP_ADDRESS ].values.postcode,
		countryCode: store.state[ NS_MEMBERSHIP_ADDRESS ].values.country,
		applicantType: addressTypeName( store.getters[ NS_MEMBERSHIP_ADDRESS + '/addressType' ] ),
	};
} );

const trackAddressForm = () => {
	trackFormSubmission( addressFieldsRef.value );
};

const { submit, previousPage, submitValuesForm } = useAddressFormEventHandlers(
	store,
	emit,
	isDirectDebitPayment,
	props.validateAddressUrl.toString(),
	props.validateEmailUrl.toString(),
	trackAddressForm,
);

</script>
