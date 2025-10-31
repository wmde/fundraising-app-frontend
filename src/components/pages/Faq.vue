<template>
	<ContentCard>
		<template #heading>
			<h1>{{ $t('faq_headline') }}</h1>
		</template>
		<template #content>
			<section v-for="(topic, index) in content.topics" :key="index" class="accordion-group flow">
				<h2>{{ topic.name }}</h2>
				<Accordion>
					<AccordionItem
						v-for="( content, itemIndex ) in getQuestionsByTopic( topic )"
						:key="topic.id + itemIndex"
					>
						<template #title>
							{{ content.question }}
						</template>
						<template #content>
							<div v-html="appendCampaignQueryParams( content.visibleText, campaignParams )"/>
						</template>
					</AccordionItem>
				</Accordion>
			</section>
		</template>
	</ContentCard>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import type { FaqContent, QuestionModel, Topic } from '@src/view_models/faq';
import { QUERY_STRING_INJECTION_KEY } from '@src/util/createCampaignQueryString';
import { appendCampaignQueryParams } from '@src/util/append_campaign_query_params';
import ContentCard from '@src/components/patterns/ContentCard.vue';
import Accordion from '@src/components/patterns/Accordion.vue';
import AccordionItem from '@src/components/patterns/AccordionItem.vue';

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
