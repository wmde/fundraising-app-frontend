<template>
	<div class="address-page">
		<h1 class="title is-size-1">{{ $t('membership_form_headline' ) }}</h1>
		<membership-type v-if="showMembershipTypeOption"></membership-type>
		<address-fields
				:validate-address-url="validateAddressUrl"
				:validate-email-url="validateEmailUrl"
				:countries="countries"
				:salutations="salutations"
				:address-validation-patterns="addressValidationPatterns"
				:date-of-birth-validation-pattern="dateOfBirthValidationPattern"
				ref="address">
		</address-fields>
		<div class="level has-margin-top-18">
			<div class="level-left">
				<b-button id="next" :class="[ 'is-form-input-width', $store.getters.isValidating ? 'is-loading' : '', 'level-item']"
						@click="next()"
						type="is-primary is-main">
					{{ $t('donation_form_section_continue') }}
				</b-button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import MembershipType from '@/components/pages/membership_form//MembershipType.vue';
import AddressFields from '@/components/pages/membership_form/Address.vue';
import { NS_MEMBERSHIP_ADDRESS } from '@/store/namespaces';
import { AddressValidation } from '@/view_models/Validation';
import { Salutation } from '@/view_models/Salutation';

export default Vue.extend( {
	name: 'AddressPage',
	components: {
		MembershipType,
		AddressFields,
	},
	props: {
		validateAddressUrl: String,
		validateEmailUrl: String,
		countries: Array as () => Array<String>,
		salutations: Array as () => Array<Salutation>,
		showMembershipTypeOption: Boolean,
		addressValidationPatterns: Object as () => AddressValidation,
		dateOfBirthValidationPattern: String,
	},
	methods: {
		next() {
			( this.$refs.address as any ).validateForm().then( () => {
				if ( this.formIsValid() ) {
					this.$emit( 'next-page' );
				} else {
					document.getElementsByClassName( 'is-danger' )[ 0 ]?.scrollIntoView( { behavior: 'smooth', block: 'center', inline: 'nearest' } );
				}
			} );
		},
		formIsValid() {
			if ( !this.$store.getters[ NS_MEMBERSHIP_ADDRESS + '/requiredFieldsAreValid' ] ) {
				return false;
			}
			if ( !this.$store.getters[ NS_MEMBERSHIP_ADDRESS + '/membershipTypeIsValid' ] ) {
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
