<template>
	<div class="has-margin-top-18 payment-notice" v-html="paymentNotice"></div>
</template>

<script>

const paymentTypeNotices = {
	'UEB': 'donation_confirmation_payment_bank_transfer_alt',
	'BEZ': 'donation_confirmation_payment_direct_debit',
	'PPL': '',
	'MCP': '',
	'SUB': '',
};

export default {
	name: 'PaymentNotice',
	props: [ 'payment' ],
	computed: {
		paymentNotice: function () {
			const paymentTypeNotice = paymentTypeNotices[ this.payment.paymentType ];

			return paymentTypeNotice === '' ? '' : this.$t( paymentTypeNotice, {
				formattedAmount: this.$n( this.payment.amount, { key: 'currency', currencyDisplay: 'name' } ),
			} );
		},
	},
};
</script>
