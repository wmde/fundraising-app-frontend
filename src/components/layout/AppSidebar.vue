<template>
	<div class="sidebar-cards">
		<div class="sidebar-card">
			<h2 class="sidebar-card-title"><InfoIcon/>{{ $t('sidebar_getintouch_headline') }}</h2>
			<p v-html="appendCampaignQueryParams( $t('sidebar_getintouch_mixed'), campaignParams )"></p>
			<slot name="default"/>
		</div>
		<div class="sidebar-card">
			<h2 class="sidebar-card-title"><BankIcon/>{{ $t('bank_data_title') }}</h2>
			<BankData/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import BankData from '@src/components/shared/BankData.vue';
import BankIcon from '@src/components/shared/icons/BankIcon.vue';
import InfoIcon from '@src/components/shared/icons/InfoIcon.vue';
import { appendCampaignQueryParams } from '@src/util/append_campaign_query_params';
import { QUERY_STRING_INJECTION_KEY } from '@src/util/createCampaignQueryString';

const campaignParams = inject<string>( QUERY_STRING_INJECTION_KEY, '' );

</script>

<style lang="scss">
@use "@src/scss/settings/units";
@use "@src/scss/settings/colors";
@use '@src/scss/settings/breakpoints';
@use 'sass:map';

.sidebar-cards {
	@include breakpoints.tablet-up {
		padding: 0 0 0 map.get( units.$spacing, 'small' );
	}
}

.sidebar-card {
	background: colors.$white;
	padding: map.get( units.$spacing, 'small' );
	border-bottom: 1px solid colors.$primary;
	margin-bottom: map.get( units.$spacing, 'small' );
	line-height: 1.5;

	p {
		margin-bottom: 0;
	}

	ul {
		padding-left: 0;
		list-style-type: none;
	}

	&:last-child {
		margin-bottom: 0;
	}

	.sidebar-card-title {
		position: relative;
		padding-left: 24px;
		font-weight: bold;
		font-size: 1em;
		line-height: 1.5;
		margin: 0;

		svg {
			position: absolute;
			left: 0;
			top: 5px;
		}
	}
}
</style>
