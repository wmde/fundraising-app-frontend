<template>
	<div class="summary-bank-data">
		<h3>{{ $t('donation_form_summary_bank_data') }}</h3>
		<p>{{ $t('donation_form_summary_iban') }}: {{ iban }}</p>
		<p>{{ $t('donation_form_summary_account_holder') }}: {{ accountHolder }}</p>
	</div>
</template>

<script setup lang="ts">
import { useStore } from 'vuex';

const store = useStore();
const iban = store.state.form.iban;
const accountHolder = store.state.form.accountHolder;
</script>
