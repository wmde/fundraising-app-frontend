<template>
	<ContentCard>
		<template #heading>
			<h1>{{ $t('faq_headline') }}</h1>
		</template>
		<template #content>
			<section v-for="(topic, index) in content.topics" :key="index" class="flow">
				<h2>{{ topic.name }}</h2>
				<div>
					<AccordionItem
						v-for="( content, itemIndex ) in getQuestionsByTopic( topic )"
						:key="topic.id + itemIndex"
						:id="`faq-item-${topic.id}-${itemIndex}`"
						:title="content.question"
						:content="appendCampaignQueryParams( content.visibleText, campaignParams )"
					/>
				</div>
			</section>
		</template>
	</ContentCard>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import type { FaqContent, QuestionModel, Topic } from '@src/view_models/faq';
import AccordionItem from '@src/components/shared/AccordionItem.vue';
import { QUERY_STRING_INJECTION_KEY } from '@src/util/createCampaignQueryString';
import { appendCampaignQueryParams } from '@src/util/append_campaign_query_params';
import ContentCard from '@src/components/patterns/ContentCard.vue';

interface Props {
	content: FaqContent;
}

const props = defineProps<Props>();
const campaignParams = inject( QUERY_STRING_INJECTION_KEY, '' );

const getQuestionsByTopic = ( topic: Topic ): QuestionModel[] => {
	return props.content.questions.filter( ( question ) =>
		question.topic.split( ',' ).indexOf( topic.id ) !== -1
	);
};
</script>

<style lang="scss">
@use 'src/scss/settings/units';
@use 'sass:map';

ul.faq-item {
	list-style-type: none;
	padding-left: 0;

	>li:not( :last-child ) {
		margin-bottom: map.get( units.$spacing, 'xx-large' );
	}
}
</style>
