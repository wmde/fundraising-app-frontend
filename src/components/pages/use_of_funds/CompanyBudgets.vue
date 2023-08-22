<template>
  <table class="company_budgets">
    <tr v-for="company in companies" :class="'company_budgets__row--' + company.name.toLowerCase()" :key="company.name">
      <td class="company_budgets__col--company">{{ company.name }} </td>
      <td class="company_budgets__col--graph">
						<span class="company_budgets__budget_line"
                  :style="{ width: ( company.budget / highestBudget * 100 ) + '%' }">&#xa0;</span>
      </td>
      <td class="company_budgets__col--budget_number has-text-right">
        <span class="company_budgets__number">{{ company.budgetString }}</span>
        <span class="company_budgets__inline-citation"><CompanyCitation :company="company" :citation-label="citationLabel" /></span>
      </td>
      <td class="company_budgets__col--citation has-text-right"><CompanyCitation :company="company" :citation-label="citationLabel" /></td>
    </tr>
  </table>
</template>

<script lang="ts">

import { computed, defineComponent, PropType } from 'vue';
import CompanyCitation from './CompanyCitation.vue';
import { Company } from '@src/components/pages/use_of_funds/Company';

export default defineComponent( {
	name: 'CompanyBudgets',
	components: {
		CompanyCitation,
	},
	props: {
		companies: {
			type: Array as PropType<Array<Company>>,
			required: true,
		},
		citationLabel: {
			type: String,
			required: true,
		},
	},
	setup( props ) {
		const highestBudget = computed( () => props.companies.reduce( ( budget: number, company: Company ) =>
			Math.max( budget, company.budget ), 0 )
		);

		return {
			highestBudget,
		};
	},
} );
</script>

<style scoped>

</style>
