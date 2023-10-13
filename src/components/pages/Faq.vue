<template>
	<div id="faq" class="content">
		<h1 class="title is-size-1">{{ $t('faq_headline') }}</h1>
		<ul class="faq-item">
			<li v-for="(topic, index) in content.topics" :key="index">
				<h2 class="title is-size-2 has-margin-top-36 has-margin-bottom-18">{{ topic.name }}</h2>
				<question
					v-for="(content, index) in getQuestionsByTopic(topic)"
					:content="content"
					:key="topic.id + index"
				></question>
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { FaqContent, QuestionModel, Topic } from '@src/view_models/faq';
import Question from '@src/components/pages/frequently_asked_questions/Question.vue';

interface Props {
	content: FaqContent;
}

const props = defineProps<Props>();

const getQuestionsByTopic = ( topic: Topic ): QuestionModel[] => {
	return props.content.questions.filter( ( question ) =>
		question.topic.split( ',' ).indexOf( topic.id ) !== -1
	);
};
</script>
