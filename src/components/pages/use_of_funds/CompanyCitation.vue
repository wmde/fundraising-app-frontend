<template>
	<a v-if="company.budgetCitation"
		class="company_budgets__citation_link"
		:href=company.budgetCitation
		target="_blank">
		{{ citationLabel }}
	</a>
	<span v-else>&nbsp;</span>
</template>

<script setup lang="ts">

import { Company } from '@src/components/pages/use_of_funds/Company';

interface Props {
	company: Company;
	citationLabel: String;
}

defineProps<Props>();

</script>
