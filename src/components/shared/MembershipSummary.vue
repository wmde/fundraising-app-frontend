<template>
	<div class="form-summary-content">
		<slot name="title"/>
		<p v-html="getSummary()"/>
		<slot name="content"/>
	</div>
</template>

<script lang="js">
import { defineComponent } from 'vue';
import { AddressTypeModel, addressTypeName } from '@src/view_models/AddressTypeModel';
import { YearlyMembershipFee } from '@src/view_models/MembershipFee';

class PrivateApplicantRenderer {
	static renderAddress( address, country, salutation ) {
		return salutation + address.fullName + ', '
				+ address.streetAddress + ', ' + address.postalCode + ' ' + address.city + ', ' + country
				+ ' <p>E-Mail: ' + address.email + '</p>';
	}
}
class CompanyApplicantRenderer {
	static renderAddress( address, country ) {
		return address.fullName + ', '
				+ address.streetAddress + ', ' + address.postalCode + ' ' + address.city + ', ' + country
				+ ' <p>E-Mail: ' + address.email + '</p>';
	}
}

const addressTypeRenderers = {
	[ addressTypeName( AddressTypeModel.PERSON ) ]: PrivateApplicantRenderer,
	[ addressTypeName( AddressTypeModel.COMPANY ) ]: CompanyApplicantRenderer,
};

export default defineComponent( {
	name: 'MembershipSummary',
	props: [
		'address',
		'membershipApplication',
		'salutations',
		'addressIsInvalid',
	],
	methods: {
		getSummary: function () {
			if ( this.addressIsInvalid ) {
				return this.$t( 'membership_form_review_address_is_invalid' );
			}

			const yearlyFee = new YearlyMembershipFee( this.membershipApplication.paymentIntervalInMonths, this.membershipApplication.membershipFee );
			const interval = this.$t( 'donation_form_payment_interval_' + this.membershipApplication.paymentIntervalInMonths );
			const addressTypeRenderer = addressTypeRenderers[ this.address.applicantType ];
			const formattedAmountPerInterval = this.$n( yearlyFee.membershipFeePerInterval, { key: 'currency', currencyDisplay: 'name' } );
			const formattedAmountYearly = this.renderAmount(
				yearlyFee.yearlyFee,
				yearlyFee.paymentIntervalInMonths,
				this.$t( 'donation_form_payment_interval_12' )
			);
			const membershipType = this.$t( this.membershipApplication.membershipType );
			const paymentType = this.$t( this.membershipApplication.paymentType );
			const address = addressTypeRenderer.renderAddress(
				this.address,
				this.$t( 'donation_form_country_option_' + this.address.countryCode ),
				this.renderSalutation()
			);

			return this.$t(
				'membership_confirmation_data_text',
				{
					paymentInterval: interval,
					membershipType: membershipType,
					membershipFeeFormatted: formattedAmountPerInterval,
					membershipFeeYearlyFormatted: formattedAmountYearly,
					paymentType: paymentType,
					address: address,
				}
			);
		},
		renderSalutation() {
			if ( !this.address.salutation ) {
				return '';
			}

			const salutationObject = this.$props.salutations.find( salutation => salutation.label === this.address.salutation );
			if ( salutationObject === undefined ) {
				return '';
			}
			return salutationObject?.display + ' ';
		},
		renderAmount( amount, interval, intervalTranslation ) {
			if ( interval === 12 ) {
				return '';
			}
			const formattedAmount = this.$n( amount, { key: 'currency', currencyDisplay: 'name' } );
			return `(${formattedAmount} ${intervalTranslation})`;
		},
	},
} );
</script>
