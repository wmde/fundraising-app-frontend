<template>
	<div class="feedback-wrapper has-margin-top-0 ">
		<div class="feedback-overlay-mobile transform" :class="{'animate-in': isExpanded}">
			<div class="feedback-tab-mobile">
				<a @click="isExpanded = !isExpanded"
					class="">
					<span class="feedback-tab-mobile-text">
					Feedback <chevron-down-icon v-if="isExpanded"/>
					<chevron-up-icon v-else />
				</span>
				</a>
			</div>

			<FeedbackBoxContent
				:isExpanded="isExpanded"
				v-on:collapse-feedback-box="isExpanded = false"
			/>

			<div class="grayed-modal-overlay" v-if="isExpanded"/>
		</div>

		<div class="feedback-overlay-desktop">
			<div class="feedback-button">
				<a v-if="!isExpanded"
					@click="isExpanded = true"
					type="is-primary is-low"
					class="button is-primary is-main ">
					<span>
						<chevron-right-icon />
						Schwierigkeiten beim Ausfüllen?
					</span>
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
import ChevronUpIcon from '@/components/pages/donation_form/FeedbackOverlay/ChevronUpIcon.vue';
import ChevronDownIcon from '@/components/pages/donation_form/FeedbackOverlay/ChevronDownIcon.vue';
import ChevronRightIcon from '@/components/pages/donation_form/FeedbackOverlay/ChevronRightIcon.vue';

export default Vue.extend( {
	name: 'FeedbackBox',
	components: { ChevronRightIcon, ChevronDownIcon, ChevronUpIcon, FeedbackBoxContent },
	data() {
		return {
			isExpanded: false,
		};
	},
} );
</script>
