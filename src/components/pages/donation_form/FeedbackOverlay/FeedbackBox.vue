<template>
	<div class="feedback-wrapper has-margin-top-0 ">

		<div class="feedback-overlay-mobile transform" :class="{'animate-in': isExpanded}">
			<div class="feedback-tab-mobile">
				<a
					@click="isExpanded = !isExpanded"
					type="is-primary is-low"
					class="button is-primary is-main ">
					<span class="feedback-tab-mobile-text">
					Feedback
					<b-icon v-if="isExpanded" icon="arrow-up" class="icon-size text-mobile"></b-icon>
					<b-icon v-else icon="arrow-down" class="icon-size text-mobile"></b-icon>
				</span>
				</a>
			</div>

			<FeedbackBoxContent
				:isExpanded="isExpanded"
				v-on:collapse-feedback-box="isExpanded = false"
			/>
		</div>

		<div class="feedback-overlay-desktop">
			<div class="feedback-button">
				<a v-if="!isExpanded"
					@click="isExpanded = true"
					type="is-primary is-low"
					class="button is-primary is-main ">
					<span> > Schwierigkeiten beim Ausfüllen? </span>
				</a>
			</div>

			<FeedbackBoxContent
				v-if="isExpanded"
				:isExpanded="isExpanded"
				v-on:collapse-feedback-box="isExpanded = false"
			/>
		</div>

	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import FeedbackBoxContent from '@/components/pages/donation_form/FeedbackOverlay/FeedbackBoxContent.vue';

export default Vue.extend( {
	name: 'FeedbackBox',
	components: { FeedbackBoxContent },
	data() {
		return {
			isExpanded: false,
		};
	},
} );
</script>
