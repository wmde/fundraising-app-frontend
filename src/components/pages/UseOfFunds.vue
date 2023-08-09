<template>
	<div class="use_of_funds">
		<div class="use_of_funds__section">
			<div class="use_of_funds__section_intro">
				<h1 class="title is-1 has-margin-bottom-18">{{ content.intro.headline }}</h1>
				<div>{{ content.intro.text }}</div>
			</div>
		</div>

		<FundsDistributionAccordion :application-of-funds-data="content.applicationOfFundsData" />
		<FundsDistributionInfo :application-of-funds-data="content.applicationOfFundsData" />

		<div class="use_of_funds__section">
			<p class="use_of_funds__info_text" v-html="content.detailedReports.mixed.text"></p>
		</div>
		<div class="use_of_funds__section use_of_funds__section--two-cols">
			<div class="use_of_funds__column">
				<div class="use_of_funds__benefits_list">
					<h2>{{ content.benefitsList.headline }}</h2>
					<ul class="use_of_funds__icon-list">
						<li v-for="benefit in content.benefitsList.benefits"
								:class="'use_of_funds__icon-list_item--' + benefit.icon"
								:key=benefit.text>
							{{ benefit.text }}
						</li>
					</ul>
				</div>
			</div>
			<div class="use_of_funds__column">
				<div class="use_of_funds__comparison">
					<h2>{{ content.comparison.headline }}</h2>
					<div>
						<p v-for="text in content.comparison.paragraphs" :key="text">{{ text }}</p>
						<h3>{{ content.comparison.subhead }}</h3>
					</div>
					<CompanyBudgets
							:companies="content.comparison.companies"
							:citation-label="content.comparison.citationLabel"/>
				</div>
			</div>
		</div>
		<div class="use_of_funds__section use_of_funds__section--orgchart">
			<div class="use_of_funds__orgchart_text">
				<h2>{{ content.orgchart.headline }}</h2>
				<div>
					<p v-for="para in content.orgchart.paragraphs" :key="para" v-html="highlightOrganisation( para )"></p>
				</div>
			</div>
			<div class="use_of_funds__orgchart_image">
				<img :src="assetsPath + '/images/WMDE-funds-forwarding.gif'" />
			</div>
		</div>
		<div class="banner_model__section use_of_funds__section--call_to_action">
			<button class="use_of_funds__button" onclick="location.href='/'">{{ content.callToAction }}</button>
		</div>
	</div>
</template>

<script lang="ts">

import CompanyBudgets from '@/components/pages/use_of_funds/CompanyBudgets.vue';
import FundsDistributionAccordion from '@/components/pages/use_of_funds/FundsDistributionAccordion.vue';
import FundsDistributionInfo from '@/components/pages/use_of_funds/FundsDistributionInfo.vue';
import { defineComponent } from 'vue';
export default defineComponent( {
	name: 'use-of-funds',
	components: {
		CompanyBudgets,
		FundsDistributionAccordion,
		FundsDistributionInfo,
	},
	props: {
		content: {
			type: Object,
			required: true,
		},
		assetsPath: {
			type: String,
			required: true,
		},
	},
	setup() {
		const highlightOrganisation = ( content: string ): string => {
			return content.replace( /<(wmf|wmde)>([^<]*)<\/\1>/g, '<span class="use_of_funds__org--$1">$2</span>' );
		};
		return {
			highlightOrganisation,
		};
	},
} );
</script>

<style lang="scss">
@import '../../scss/use_of_funds/FundsContent';
@import '../../scss/use_of_funds/CompanyBudgets';
@import'../../scss/use_of_funds/FundsDistributionInfo';
@import'../../scss/use_of_funds/FundsDistributionAccordion';
</style>
