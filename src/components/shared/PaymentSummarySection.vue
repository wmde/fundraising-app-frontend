<template>
	<h3>{{ $t('form_summary_bank_details') }}</h3>
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

interface Props {
	bankData: { iban: string; bic?: string; bankName?: string };
}
defineProps<Props>();
</script>
