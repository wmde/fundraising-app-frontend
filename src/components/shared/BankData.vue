<template>
	<ul class="bank-data-content">
		<li><strong>{{ $t( 'bank_data_account_owner' ) }}:</strong> {{ $t( 'bank_data_operator_account_owner' ) }}</li>
		<li>
			<strong>{{ $t( 'bank_data_iban')  }}:</strong>
			<span
					class="spacer"
					v-for="( ibanPartial, index ) in ibanParts"
					:key="index">{{ ibanPartial }}</span>
		</li>
		<li><strong>{{ $t( 'bank_data_bic')  }}:</strong> {{ $t( 'bank_data_operator_account_bic')  }}</li>
		<li>{{ $t( 'bank_data_operator_bank_name')  }}</li>
		<li v-if="bankTransferCode">
			<strong>{{ $t( 'bank_data_transfer_code' ) }}:</strong>
			<span class="bank-transfer-code"> {{ bankTransferCode }}</span>
		</li>
	</ul>
</template>
<script setup lang="ts">

import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

interface Props {
	bankTransferCode?: String;
}

defineProps<Props>();

const { t } = useI18n();
const ibanParts = computed( () => t( 'bank_data_operator_account_iban' ).split( ' ' ) );

</script>
<style lang="scss">
.bank-transfer-code {
	white-space: nowrap;
}
</style>
