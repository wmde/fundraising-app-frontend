<template>
	<div class="bank-data-content">
		<p><strong>{{ $t( 'bank_data_account_owner' ) }}:</strong> {{ $t( 'bank_data_operator_account_owner' ) }}</p>
		<p>
			<strong>{{ $t( 'bank_data_iban')  }}:</strong>
			<span
					class="spacer"
					v-for="( ibanPartial, index ) in formatIban()"
					:key="index">{{ ibanPartial }}</span>
		</p>
		<p><strong>{{ $t( 'bank_data_bic')  }}:</strong> {{ $t( 'bank_data_operator_account_bic')  }}</p>
		<p>{{ $t( 'bank_data_operator_bank_name')  }}</p>
		<p v-if="bankTransferCode">
			<strong>{{ $t( 'bank_data_transfer_code' ) }}:</strong>
			<span class="bank-transfer-code"> {{ bankTransferCode }}</span>
		</p>
	</div>
</template>
<script>
export default {
	name: 'BankData',
	props: [
		'bankTransferCode',
	],
	methods: {
		formatIban: function () {
			return this.$t( 'bank_data_operator_account_iban' ).split( ' ' );
		},
	},
};
</script>
<style lang="scss">
	.bank-transfer-code{
		white-space: nowrap;
	}
</style>
