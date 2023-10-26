<template>
	<div id="faq" class="faq">
		<h1>{{ $t('faq_headline') }}</h1>

		<ul class="faq-item">
			<li v-for="(topic, index) in content.topics" :key="index">
				<h2>{{ topic.name }}</h2>
				<Question
					v-for="(content, index) in getQuestionsByTopic(topic)"
					:content="content"
					:key="topic.id + index"
				/>
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
