<template>
	<ContentCard :is-sidebar-card="true">
		<template #content>
			<IconText :is-small-heading="true">
				<template #icon><InfoIcon/></template>
				<template #content><h2>{{ $t('sidebar_getintouch_headline') }}</h2></template>
			</IconText>
			<p v-html="appendCampaignQueryParams( $t('sidebar_getintouch_mixed'), campaignParams )"></p>
			<slot name="default"/>
		</template>
	</ContentCard>
	<ContentCard :is-sidebar-card="true">
		<template #content>
			<IconText :is-small-heading="true">
				<template #icon><BankIcon/></template>
				<template #content><h2>{{ $t('bank_data_title') }}</h2></template>
			</IconText>
			<BankData/>
		</template>
	</ContentCard>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import BankData from '@src/components/shared/BankData.vue';
import BankIcon from '@src/components/shared/icons/BankIcon.vue';
import InfoIcon from '@src/components/shared/icons/InfoIcon.vue';
import { appendCampaignQueryParams } from '@src/util/append_campaign_query_params';
import { QUERY_STRING_INJECTION_KEY } from '@src/util/createCampaignQueryString';
import ContentCard from '@src/components/patterns/ContentCard.vue';
import IconText from '@src/components/patterns/IconText.vue';

const campaignParams = inject<string>( QUERY_STRING_INJECTION_KEY, '' );

</script>
