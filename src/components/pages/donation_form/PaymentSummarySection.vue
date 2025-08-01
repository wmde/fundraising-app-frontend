<template>
	<div>
		<h3>{{ $t('donation_form_summary_bank_details') }}</h3>
		<strong>{{ $t('donation_form_summary_iban') }}</strong> {{ bankData.iban }}<br>
		<strong v-if="bankData.bic">{{ $t('donation_form_summary_bic') }}</strong> {{ bankData.bic }}<br>
		<strong v-if="bankData.bankName">{{ $t('donation_form_summary_bank_name') }}</strong> {{ bankData.bankName }}
	</div>
</template>

<script setup lang="ts">

interface Props {
	bankData: { iban: string; bic: string; bankName: string } | undefined;
}
defineProps<Props>();
</script>
