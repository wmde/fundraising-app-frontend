<template>
	<span v-html="getSummary()"/>
</template>

<script>
import { clearStreetAndBuildingNumberSeparator } from '@src/util/street_and_building_number_tools';

export default {
	name: 'PaymentSummaryCompany',
	props: [
		'address',
		'interval',
		'formattedAmount',
		'paymentType',
		'country',
		'languageItem',
	],
	methods: {
		getSummary: function () {
			return this.$t(
				this.$props.languageItem,
				{
					interval: this.$props.interval,
					formattedAmount: this.$props.formattedAmount,
					paymentType: this.$props.paymentType,
					personType: this.$t( 'donation_confirmation_topbox_donor_type_company' ),
					address: this.addressString(),
					email: this.email(),
				}
			);
		},
		email: function () {
			if ( !this.address.email ) {
				return this.$t( 'donation_confirmation_review_email_missing' );
			}
			return this.address.email;
		},
		addressString: function () {
			if ( !this.canRenderAddress() ) {
				return this.$t( 'donation_confirmation_review_address_missing' );
			}
			return [
				this.$props.address.fullName,
				clearStreetAndBuildingNumberSeparator( this.$props.address.streetAddress ),
				this.$props.address.postalCode + ' ' + this.$props.address.city,
				this.$props.country,
			].join( ', ' );
		},
		canRenderAddress: function () {
			return this.$props.address.fullName
				&& this.$props.address.streetAddress
				&& this.$props.address.postalCode
				&& this.$props.address.city;
		},
	},
};
</script>
