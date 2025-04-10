<template>
	<div class="use-of-funds">
		<h1>{{ content.title }}</h1>
		<p class="use-of-funds-summary-text">{{ content.summary }}</p>

		<div class="use-of-funds-usage">
			<div class="use-of-funds-usage-accordion">
				<details v-for="( accordionItem, index ) in content.accordion.items" :key="index">
					<summary tabindex="0">
						{{ accordionItem.title }}
						<ChevronDown/>
					</summary>
					<div v-html="accordionItem.content"/>
				</details>
			</div>
			<p class="use-of-funds-summary-text" v-html="content.accordion.summary"/>
		</div>

		<CallToAction :text="content.callToAction"/>

		<div class="use-of-funds-benefits">
			<h2>{{ content.benefits.title }}</h2>

			<ul>
				<li v-for="( benefitItem, index ) in content.benefits.items" :key="index">
					<BenefitsIcon :icon="benefitItem.icon"/>
					<span>{{ benefitItem.content }}</span>
				</li>
			</ul>
		</div>

		<div class="use-of-funds-revenue-comparison">
			<div class="use-of-funds-revenue-comparison-content">
				<h2>{{ content.revenueComparison.title }}</h2>
				<p v-for="( paragraph, index ) in content.revenueComparison.content" :key="index">
					{{ paragraph }}
				</p>
			</div>

			<div class="use-of-funds-revenue-comparison-companies">
				<h3>{{ content.revenueComparison.companies.title }}</h3>
				<ul>
					<li v-for="company in content.revenueComparison.companies.items" :key="company.name">
						<span class="use-of-funds-companies-company">{{ company.name }}</span>
						<span class="use-of-funds-companies-graph">
							<span class="use-of-funds-companies-budget-line" :style="{ width: ( company.budget / highestBudget * 100 ) + '%' }">&#xa0;</span>
						</span>
						<span class="use-of-funds-companies-number">
							{{ company.budgetString }}
						</span>
						<span class="use-of-funds-companies-link">
							<a v-if="company.link !== ''" class="company_budgets__citation_link" :href="company.link" target="_blank">
								{{ company.linkText }} <ExternalLink/>
							</a>
							<span v-else>&nbsp;</span>
						</span>
					</li>
				</ul>
			</div>
		</div>

		<CallToAction :text="content.callToAction"/>

		<p v-html="content.closingParagraph"/>
	</div>
</template>

<script setup lang="ts">

import { RevenueComparisonItem, UseOfFundsContent } from '@src/components/pages/use_of_funds/UseOfFundsContent';
import BenefitsIcon from '@src/components/pages/use_of_funds/BenefitsIcon.vue';
import { computed } from 'vue';
import CallToAction from '@src/components/pages/use_of_funds/CallToAction.vue';
import ChevronDown from '@src/components/shared/icons/ChevronDown.vue';
import ExternalLink from '@src/components/shared/icons/ExternalLink.vue';

interface Props {
	content: UseOfFundsContent;
}

const props = defineProps<Props>();

const highestBudget = computed( () => props.content.revenueComparison.companies.items.reduce( ( budget: number, company: RevenueComparisonItem ) =>
	Math.max( budget, company.budget ), 0 )
);

</script>

<style lang="scss">
@use '@src/scss/settings/colors';
@use '@src/scss/settings/units';
@use '@src/scss/settings/breakpoints';
@use 'sass:map';

.use-of-funds {
	--text-color: #{colors.$black};

	--usage-1-background: #ecfffb;
	--usage-1-color: #10826b;
	--usage-2-background: #ffefef;
	--usage-2-color: #9d0000;
	--usage-3-background: #d7edff;
	--usage-3-color: #154985;
	--usage-4-background: #f3f3f3;
	--usage-4-color: #555555;

	--benefits-list-icon: #{colors.$black};
	--benefits-background: #{colors.$gray-lighter};

	--budget-line-background: #cecece;
	--budget-line-background-wikipedia: #{colors.$primary};

	--call-to-action-color: #{colors.$white};
	--call-to-action-background: #{colors.$primary};
	--call-to-action-background-hover: #{colors.$primary-hover};

	color: var( --text-color );

	h2 {
		font-weight: bold;
		font-size: 18px;

		@include breakpoints.tablet-up {
			font-size: 22px;
		}

		@include breakpoints.desktop-up {
			font-size: 24px;
		}
	}

	&-summary-text {
		@include breakpoints.tablet-up {
			font-size: 18px;
		}
	}

	&-usage {
		margin-bottom: map.get( units.$spacing, 'small' );
		display: block;

		@include breakpoints.desktop-up {
			margin-bottom: map.get( units.$spacing, 'large' );
		}

		&-accordion {
			margin-bottom: map.get( units.$spacing, 'small' );
		}

		details {
			margin-bottom: 1px;

			summary {
				position: relative;
				list-style-type: none;
				font-size: 18px;
				font-weight: bold;
				padding: 14px 46px 14px 14px;
				cursor: pointer;

				&::-webkit-details-marker {
					display: none;
				}

				svg {
					position: absolute;
					right: 14px;
					top: 50%;
					margin-top: -5px;
				}
			}

			> div {
				padding: 0 46px 14px 14px;
			}

			&[open] summary svg {
				transform: rotate( 180deg );
			}

			&:nth-child( 1 ) {
				--chevron-stroke: var( --usage-1-color );
				background: var( --usage-1-background );
				summary {
					color: var( --usage-1-color );
				}
			}

			&:nth-child( 2 ) {
				--chevron-stroke: var( --usage-2-color );
				background: var( --usage-2-background );
				summary {
					color: var(--usage-2-color);
				}
			}

			&:nth-child( 3 ) {
				--chevron-stroke: var( --usage-3-color );
				background: var( --usage-3-background );
				summary {
					color: var(--usage-3-color);
				}
			}

			&:nth-child( 4 ) {
				--chevron-stroke: var( --usage-4-color );
				background: var( --usage-4-background );
				summary {
					color: var(--usage-4-color);
				}
			}
		}
	}

	&-benefits {
		background: var( --benefits-background );
		margin: 0 ( -( map.get( units.$spacing, 'small' ) ) ) map.get( units.$spacing, 'small' );
		padding: map.get( units.$spacing, 'small' );

		@include breakpoints.tablet-up {
			margin: 0 ( -( map.get( units.$spacing, 'large' ) ) ) map.get( units.$spacing, 'large' );
			padding: map.get( units.$spacing, 'large' );
		}

		h2 {
			margin-bottom: map.get( units.$spacing, 'medium' );

			@include breakpoints.tablet-up {
				text-align: center;
				margin-bottom: map.get( units.$spacing, 'large' );
			}
		}

		ul {
			list-style-type: none;
			padding: 0;
			margin: 0;

			li {
				display: flex;
				margin-bottom: map.get( units.$spacing, 'medium' );

				@include breakpoints.tablet-up {
					font-size: 18px;
					margin-bottom: map.get( units.$spacing, 'large' );
					margin-right: map.get( units.$spacing, 'large' );
				}

				@include breakpoints.desktop-up {
					font-size: 20px;
					margin-bottom: map.get( units.$spacing, 'x-large' );
					margin-right: map.get( units.$spacing, 'xx-large' );
				}

				&:last-child {
					margin-bottom: 0;
				}
			}
		}
	}

	&-benefits-icon {
		display: block;
		width: 48px;
		height: 52px;
		margin-right: map.get( units.$spacing, 'x-small' );

		svg {
			width: 48px;
			height: 52px;
		}

		@include breakpoints.tablet-up {
			width: 60px;
			height: 65px;
			margin: 0 map.get( units.$spacing, 'large' ) 0;

			svg {
				width: 60px;
				height: 65px;
			}
		}

		@include breakpoints.desktop-up {
			margin: 0 map.get( units.$spacing, 'xx-large' ) 0;
		}
	}

	&-revenue-comparison {
		margin: 0 0 map.get( units.$spacing, 'small' );

		h3 {
			font-size: 18px;
			font-weight: bold;
		}

		&-content {
			margin-bottom: map.get( units.$spacing, 'small' );

			@include breakpoints.desktop-up {
				margin-bottom: map.get( units.$spacing, 'large' );
			}
		}

		@include breakpoints.tablet-up {
			display: flex;
			margin: 0 ( -( map.get( units.$spacing, 'small' ) ) ) map.get( units.$spacing, 'large' );

			&-content,
			&-companies {
				width: 50%;
				padding: 0 map.get( units.$spacing, 'small' );
				margin-bottom: 0;
			}
		}

		ul {
			list-style-type: none;
			padding: 0;

			li {
				display: flex;
			}

			li:last-child {
				.use-of-funds-companies-company {
					font-weight: bold;
				}
				.use-of-funds-companies-budget-line {
					background: var( --budget-line-background-wikipedia );
				}
			}
		}
	}

	&-companies {
		&-company {
			flex: 0 0 80px;
		}
		&-graph {
			flex: 1 0 auto;
			display: flex;
			padding: 5px 0;
			align-items: center;
		}
		&-number {
			flex: 0 0 85px;
			text-align: right;
			white-space: nowrap;
		}
		&-link {
			flex: 0 0 60px;
			font-size: 14px;
			text-align: right;
			white-space: nowrap;
		}
		&-budget-line {
			background: var( --budget-line-background );
			min-width: 3px;
			height: 10px;
		}
	}
}
</style>
