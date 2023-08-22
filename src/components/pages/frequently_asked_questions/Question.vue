<template>
	<div class="accordion-item" v-bind:class="[ isOpen ? 'accordion-open' : '' ]">
		<div @click="isOpen = !isOpen"
			:data-content-target="isOpen ? '/page/Häufige Fragen' : ''"
			:data-track-content="isOpen"
			:data-content-name="isOpen ? 'Expand' : ''"
			:data-content-piece="isOpen ? content.question : ''">
			<div v-bind:class="[ isOpen ? 'has-text-primary' : 'accordion-heading', 'icon-inline', 'accordion-title' ] ">
				{{ content.question }}
				<ArrowUp v-if="isOpen"/>
				<ArrowDown v-else/>
			</div>
		</div>
		<div v-show="isOpen" v-html="content.visibleText" class="accordion-content"></div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { QuestionModel } from '@src/view_models/faq';
import ArrowUp from '@src/components/shared/icons/ArrowUp.vue';
import ArrowDown from '@src/components/shared/icons/ArrowDown.vue';

export default defineComponent( {
	name: 'question',
	components: { ArrowDown, ArrowUp },
	props: {
		content: {
			type: Object as () => QuestionModel,
		},
	},
	data() {
		return {
			isOpen: false,
		};
	},
} );
</script>
