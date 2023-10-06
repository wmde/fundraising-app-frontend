<template>
	<div class="page-not-found">
		<h1 class="title">{{ $t( 'page_not_found_header' ) }}</h1>
		<span v-html="appendCampaignQueryParams( $t( 'page_not_found' ), campaignParams )"></span>
	</div>
</template>

<script setup lang="ts">

import { appendCampaignQueryParams } from '@src/util/append_campaign_query_params';
import { inject } from 'vue';
import { QUERY_STRING_INJECTION_KEY } from '@src/util/createCampaignQueryString';

const campaignParams = inject<string>( QUERY_STRING_INJECTION_KEY, '' );

</script>
