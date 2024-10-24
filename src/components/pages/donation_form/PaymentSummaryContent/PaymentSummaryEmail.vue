<template>
	<span v-html="getSummary()"/>
</template>

<script>
export default {
	name: 'PaymentSummaryEmail',
	props: [
		'address',
		'interval',
		'formattedAmount',
		'paymentType',
		'country',
		'languageItem',
		'salutation',
	],
	methods: {
		getSummary: function () {
			return this.$t(
				this.$props.languageItem,
				{
					interval: this.$props.interval,
					formattedAmount: this.$props.formattedAmount,
					paymentType: this.$props.paymentType,
					personType: this.$t( 'donation_confirmation_topbox_donor_type_email' ),
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
		salutationDisplay: function () {
			if ( !this.salutation || this.salutation === '' ) {
				return '';
			}
			return this.salutation + ' ';
		},
		addressString: function () {
			if ( !this.canRenderAddress() ) {
				return this.$t( 'donation_confirmation_review_address_missing' );
			}
			return this.salutationDisplay() + this.$props.address.fullName;
		},
		canRenderAddress: function () {
			return this.$props.address.salutation
				&& this.$props.address.firstName
				&& this.$props.address.lastName;
		},
	},
};
</script>
