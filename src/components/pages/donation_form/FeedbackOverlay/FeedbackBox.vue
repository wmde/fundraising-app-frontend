<template>
	<div class="feedback-wrapper has-margin-top-0 ">
		<div class="feedback-overlay-mobile transform" :class="{'animate-in': startSlidingUp, 'animate-out': startSlidingDown}">
			<div class="feedback-tab-mobile">
				<a @click="switchVisibilityForMobile()">
					<span class="feedback-tab-mobile-text">
					{{ $t( 'donation_page_feedback_box_mobile_feedback_tab' ) }}<chevron-down-icon v-if="isExpanded"/>
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
					@click="isExpanded = true">
					<chevron-right-icon />
					{{ $t( 'donation_page_feedback_box_desktop_feedback_button' ) }}
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
import { defineComponent } from 'vue';
import FeedbackBoxContent from '@src/components/pages/donation_form/FeedbackOverlay/FeedbackBoxContent.vue';
import ChevronUpIcon from '@src/components/pages/donation_form/FeedbackOverlay/ChevronUpIcon.vue';
import ChevronDownIcon from '@src/components/pages/donation_form/FeedbackOverlay/ChevronDownIcon.vue';
import ChevronRightIcon from '@src/components/pages/donation_form/FeedbackOverlay/ChevronRightIcon.vue';

export default defineComponent( {
	name: 'FeedbackBox',
	components: { ChevronRightIcon, ChevronDownIcon, ChevronUpIcon, FeedbackBoxContent },
	data() {
		return {
			isExpanded: false,
			startSlidingUp: false,
			startSlidingDown: false,
		};
	},
	methods: {
		switchVisibilityForMobile: function () {
			this.startSlidingUp = false;
			this.startSlidingDown = false;

			if ( !this.isExpanded ) {
				this.startSlidingUp = true;
				this.isExpanded = true;
			} else {
				this.startSlidingDown = true;
				this.isExpanded = false;
			}
		},
	},
} );
</script>
