<template>
	<div class="accordion-item" :class="[ isOpen ? 'accordion-open' : '' ]">
		<div
			@click="isOpen = !isOpen"
			:data-content-target="isOpen ? '/page/Häufige Fragen' : ''"
			:data-track-content="isOpen"
			:data-content-name="isOpen ? 'Expand' : ''"
			:data-content-piece="isOpen ? content.question : ''"
		>
			<div v-bind:class="[ isOpen ? 'has-text-primary' : 'accordion-heading', 'icon-inline', 'accordion-title' ] ">
				{{ content.question }}
				<ArrowUp v-if="isOpen"/>
				<ArrowDown v-else/>
			</div>
		</div>
		<div v-show="isOpen" v-html="appendCampaignQueryParams( content.visibleText, campaignParams )" class="accordion-content"></div>
	</div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue';
import { QuestionModel } from '@src/view_models/faq';
import ArrowUp from '@src/components/shared/icons/ArrowUp.vue';
import ArrowDown from '@src/components/shared/icons/ArrowDown.vue';
import { QUERY_STRING_INJECTION_KEY } from '@src/util/createCampaignQueryString';
import { appendCampaignQueryParams } from '@src/util/append_campaign_query_params';

interface Props {
	content: QuestionModel
}

defineProps<Props>();

const isOpen = ref( false );
const campaignParams = inject( QUERY_STRING_INJECTION_KEY, '' );

</script>

<style lang="scss">
@use '@src/scss/settings/colors';
@use 'src/scss/settings/units';
@use 'sass:map';

.accordion {
	&-title {
		border-bottom: 2px solid colors.$gray-mid;
		cursor: pointer;
		margin-bottom: map.get( units.$spacing, 'medium' );
	}
	&-item {
		border: none;
		box-sizing: content-box;
	}
	&-content {
		margin-bottom: 36px;
	}
}
</style>
