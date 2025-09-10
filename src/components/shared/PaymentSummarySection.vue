<template>
	<h3>{{ $t('form_summary_bank_details_header') }}</h3>
	<ul class="bankdata">
		<li>
			<strong>{{ $t('form_summary_iban') }}</strong> {{ bankData.iban }}
		</li>
		<li v-if="bankData.bic">
			<strong >{{ $t('form_summary_bic') }}</strong> {{ bankData.bic }}
		</li>
		<li v-if="bankData.bankName">
			<strong >{{ $t('form_summary_bank_name') }}</strong> {{ bankData.bankName }}
		</li>
	</ul>
</template>

<script setup lang="ts">

import type { InitialBankAccountData } from '@src/view_models/BankAccount';

interface Props {
	bankData: InitialBankAccountData;
}
defineProps<Props>();
</script>
