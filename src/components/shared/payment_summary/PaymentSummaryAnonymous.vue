<template>
	<div class="payment-summary" v-html="getSummary"></div>
</template>

<script>
export default {
	name: 'PaymentSummaryAnonymous',
	props: [
		'address',
		'interval',
		'formattedAmount',
		'paymentType',
		'country',
		'languageItem',
		'email',
	],
	computed: {
		getSummary: function () {
			return this.$t(
				this.$props.languageItem,
				{
					interval: this.$props.interval,
					formattedAmount: this.$props.formattedAmount,
					paymentType: this.$props.paymentType,
					personType: this.$t( 'donation_confirmation_topbox_donor_type_anonymous' ),
					address: this.$t( 'donation_confirmation_review_address_missing' ),
					email: this.$t( 'donation_confirmation_review_email_missing' ),
				}
			);
		},
	},
};
</script>

<style scoped>

</style>
