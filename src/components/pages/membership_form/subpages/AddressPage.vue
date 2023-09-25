<template>
	<div class="address-page">
		<address-fields
			:validate-address-url="validateAddressUrl"
			:validate-email-url="validateEmailUrl"
			:countries="countries"
			:salutations="salutations"
			:address-validation-patterns="addressValidationPatterns"
			:date-of-birth-validation-pattern="dateOfBirthValidationPattern"
			ref="addressFieldsRef">
		</address-fields>
		<div class="summary-wrapper has-margin-top-18 has-outside-border">
			<membership-summary
				:membership-application="membershipApplication"
				:address="addressSummary"
				:salutations="salutations"
				:address-is-invalid="addressIsInvalid">
			</membership-summary>
			<submit-values :tracking-data="{}"></submit-values>
			<div class="columns has-margin-top-18">
				<div class="column">
					<FunButton
						id="previous-btn"
						class="level-item is-primary is-main is-outlined"
						@click="$emit( 'previous-page' )"
					>
						{{ $t('membership_form_section_back') }}
					</FunButton>
				</div>
				<div class="column">
					<FunButton
						id="submit-btn"
						:class="[ 'level-item is-primary is-main', { 'is-loading' : $store.getters.isValidating } ]"
						@click="submit"
					>
						{{ $t('membership_form_finalize') }}
					</FunButton>
				</div>
			</div>
		</div>

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
import FunButton from '@src/components/shared/legacy_form_inputs/FunButton.vue';
import { Country } from '@src/view_models/Country';
import { useStore } from 'vuex';

interface Props {
	validateAddressUrl: String;
	validateEmailUrl: String;
	countries: Country[];
	salutations: Salutation[];
	addressValidationPatterns: AddressValidation;
	dateOfBirthValidationPattern: String;
}

defineProps<Props>();
const emit = defineEmits( [ 'previous-page', 'submit-membership' ] );
const store = useStore();

const addressFieldsRef = ref();
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

const formIsValid = () => {
	if ( !store.getters[ NS_MEMBERSHIP_ADDRESS + '/requiredFieldsAreValid' ] ) {
		return false;
	}
	if ( !store.getters[ NS_MEMBERSHIP_ADDRESS + '/dateOfBirthIsValid' ] ) {
		return false;
	}
	return true;
};

const submit = () => {
	addressFieldsRef.value.validateForm().then( () => {
		if ( formIsValid() ) {
			emit( 'submit-membership' );
		} else {
			document
				.getElementsByClassName( 'is-danger' )[ 0 ]
				.scrollIntoView( { behavior: 'smooth', block: 'center', inline: 'nearest' } );
		}
	} );
};

</script>
