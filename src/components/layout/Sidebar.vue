<template>
	<div class="sidebar-content">
		<p><strong>{{ $t('sidebar_getintouch_headline') }}</strong></p>
		<p v-html="appendCampaignQueryParams( $t('sidebar_getintouch_text' ), campaignParams )"></p>
		<p>{{ $t('sidebar_getintouch_text_phone') }}</p>
		<slot name="default"/>
	</div>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import { QUERY_STRING_INJECTION_KEY } from '@src/util/createCampaignQueryString';
import { appendCampaignQueryParams } from '@src/util/append_campaign_query_params';

const campaignParams = inject<string>( QUERY_STRING_INJECTION_KEY, '' );

</script>

<style lang="scss">
@use '@src/scss/settings/units';
@use '@src/scss/settings/breakpoints';
@use 'sass:map';

.sidebar-content {
	@include breakpoints.tablet-up {
		padding: map.get( units.$spacing, 'small' ) map.get( units.$spacing, 'small' ) 0;
	}
}
</style>
