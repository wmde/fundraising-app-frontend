<template>
	<ul class="bank-data-list">
		<li><ContentCopier :label="$t( 'bank_data_account_owner' )" :value="$t( 'bank_data_operator_account_owner' )"/></li>
		<li class="highlighted-content-text">
			<ContentCopier
				:label="$t( 'bank_data_iban')"
				:value="$t( 'bank_data_operator_account_iban' )"
				:copy-value="$t( 'bank_data_operator_account_iban' ).replaceAll( ' ', '' )"
			/>
		</li>
		<li><ContentCopier :label="$t( 'bank_data_bic')" :value="$t( 'bank_data_operator_account_bic')"/></li>
		<li>{{ $t( 'bank_data_operator_bank_name')  }}</li>
		<li v-if="bankTransferAmount">
			<strong>{{ $t( 'bank_data_transfer_amount_label' ) }}: </strong>
			<span class="bank-transfer-code"> {{ bankTransferAmount }}</span>
		</li>
		<li v-if="bankTransferCode">
			<ContentCopier
				:label="$t( 'bank_data_transfer_code' )"
				:value="bankTransferCode.toString()"
			/>
		</li>
	</ul>
</template>
<script setup lang="ts">

import ContentCopier from '@src/components/shared/ContentCopier.vue';

interface Props {
	bankTransferCode?: String;
	bankTransferAmount?: String;
}

defineProps<Props>();
</script>
<style lang="scss">
.bank-transfer-code {
	white-space: nowrap;
}
</style>
