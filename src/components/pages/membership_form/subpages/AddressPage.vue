<template>
	<div class="address-page">
		<address-fields
				:validate-address-url="validateAddressUrl"
				:validate-email-url="validateEmailUrl"
				:countries="countries"
				:salutations="salutations"
				:address-validation-patterns="addressValidationPatterns"
				:date-of-birth-validation-pattern="dateOfBirthValidationPattern"
				ref="address">
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
					<b-button id="previous-btn" class="level-item"
						@click="$emit( 'previous-page' )"
						type="is-primary is-main"
						outlined>
						{{ $t('membership_form_section_back') }}
					</b-button>
				</div>
				<div class="column">
					<b-button id="submit-btn" :class="[ $store.getters.isValidating ? 'is-loading' : '', 'level-item']"
						@click="submit"
						type="is-primary is-main">
						{{ $t('membership_form_finalize') }}
					</b-button>
				</div>
			</div>
		</div>

	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import MembershipSummary from '@/components/shared/MembershipSummary.vue';
import AddressFields from '@/components/pages/membership_form/Address.vue';
import SubmitValues from '@/components/pages/membership_form/SubmitValues.vue';
import { NS_MEMBERSHIP_ADDRESS, NS_MEMBERSHIP_FEE } from '@/store/namespaces';
import { AddressValidation } from '@/view_models/Validation';
import { Salutation } from '@/view_models/Salutation';
import { membershipTypeName } from '@/view_models/MembershipTypeModel';
import { addressTypeName } from '@/view_models/AddressTypeModel';
import { mapGetters } from 'vuex';

export default Vue.extend( {
	name: 'AddressPage',
	components: {
		AddressFields,
		MembershipSummary,
		SubmitValues,
	},
	props: {
		validateAddressUrl: String,
		validateEmailUrl: String,
		countries: Array as () => Array<String>,
		salutations: Array as () => Array<Salutation>,
		addressValidationPatterns: Object as () => AddressValidation,
		dateOfBirthValidationPattern: String,
	},
	computed: {
		...mapGetters( NS_MEMBERSHIP_ADDRESS, [ 'addressType' ] ),
		addressIsInvalid: {
			get(): boolean {
				return !this.$store.getters[ NS_MEMBERSHIP_ADDRESS + '/requiredFieldsAreValid' ];
			},
		},
		membershipApplication: {
			get(): object {
				const payment = this.$store.state[ NS_MEMBERSHIP_FEE ].values;
				return {
					paymentIntervalInMonths: payment.interval,
					membershipFee: payment.fee / 100,
					paymentType: payment.type,
					membershipType: membershipTypeName( this.$store.getters[ NS_MEMBERSHIP_ADDRESS + '/membershipType' ] ),
				};
			},
		},
		addressSummary: {
			get(): object {
				return {
					...this.$store.state[ NS_MEMBERSHIP_ADDRESS ].values,
					fullName: this.$store.getters[ NS_MEMBERSHIP_ADDRESS + '/fullName' ],
					streetAddress: this.$store.state[ NS_MEMBERSHIP_ADDRESS ].values.street,
					postalCode: this.$store.state[ NS_MEMBERSHIP_ADDRESS ].values.postcode,
					countryCode: this.$store.state[ NS_MEMBERSHIP_ADDRESS ].values.country,
					applicantType: addressTypeName( this.$store.getters[ NS_MEMBERSHIP_ADDRESS + '/addressType' ] ),
				};
			},
		},
	},
	methods: {
		submit() {
			( this.$refs.address as any ).validateForm().then( () => {
				if ( this.formIsValid() ) {
					this.$emit( 'submit-membership' );
				} else {
					document.getElementsByClassName( 'is-danger' )[ 0 ].scrollIntoView( { behavior: 'smooth', block: 'center', inline: 'nearest' } );
				}
			} );
		},
		formIsValid() {
			if ( !this.$store.getters[ NS_MEMBERSHIP_ADDRESS + '/requiredFieldsAreValid' ] ) {
				return false;
			}
			if ( !this.$store.getters[ NS_MEMBERSHIP_ADDRESS + '/dateOfBirthIsValid' ] ) {
				return false;
			}
			return true;
		},
	},
} );
</script>
