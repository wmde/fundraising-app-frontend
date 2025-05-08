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
				this.languageItem,
				{
					interval: this.interval,
					formattedAmount: this.formattedAmount,
					paymentType: this.paymentType,
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
			const addressLines = [];

			if ( this.address.fullName ) {
				addressLines.push( this.address.fullName );
			}
			if ( this.address.streetAddress ) {
				addressLines.push( clearStreetAndBuildingNumberSeparator( this.address.streetAddress ) );
			}
			if ( this.address.postalCode || this.address.city ) {
				addressLines.push( `${ this.address.postalCode || '' } ${ this.address.city || '' }`.trim() );
			}
			if ( this.country ) {
				addressLines.push( this.country );
			}
			if ( addressLines.length === 0 ) {
				return this.$t( 'donation_confirmation_review_address_missing' );
			}

			return addressLines.filter( Boolean ).join( '<br/>' );
		},
	},
};
</script>
