<template>
	<span v-html="getSummary"/>
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
					personType: '',
					address: '',
					email: '',
				}
			);
		},
	},
};
</script>

<style scoped>

</style>
