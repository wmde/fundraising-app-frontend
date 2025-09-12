<template>
	<ContentCard>
		<template #heading>
			<h1 class="title">{{ $t( 'page_not_found_header' ) }}</h1>
		</template>
		<template #content>
			<span v-html="appendCampaignQueryParams( $t( 'page_not_found' ), campaignParams )"></span>
		</template>
	</ContentCard>
</template>

<script setup lang="ts">

import { appendCampaignQueryParams } from '@src/util/append_campaign_query_params';
import { inject } from 'vue';
import { QUERY_STRING_INJECTION_KEY } from '@src/util/createCampaignQueryString';
import ContentCard from '@src/components/patterns/ContentCard.vue';

const campaignParams = inject<string>( QUERY_STRING_INJECTION_KEY, '' );

</script>
