<template>
	<ul class="company_budgets">
		<li
			class="company_budgets__row"
			v-for="company in companies"
			:key="company.name"
			:class="`company_budgets__row--${ company.name.toLowerCase() }`"
		>
			<span class="company_budgets__col--company">{{ company.name }}</span>
			<span class="company_budgets__col--graph">
				<span class="company_budgets__budget_line" :style="{ width: ( company.budget / highestBudget * 100 ) + '%' }">&#xa0;</span>
			</span>
			<span class="company_budgets__col--number">
				{{ company.budgetString }}
			</span>
			<span class="company_budgets__col--citation">
				<CompanyCitation :company="company" :citation-label="citationLabel"/>
			</span>
		</li>
	</ul>
</template>

<script setup lang="ts">

import { computed } from 'vue';
import CompanyCitation from './CompanyCitation.vue';
import { Company } from '@src/components/pages/use_of_funds/Company';

interface Props {
	companies: Company[];
	citationLabel: string;
}

const props = defineProps<Props>();

const highestBudget = computed( () => props.companies.reduce( ( budget: number, company: Company ) =>
	Math.max( budget, company.budget ), 0 )
);

</script>
