<template>
	<div class="feedback-content-box">

		<a @click="$emit( 'collapse-feedback-box' )" class="feedback-close">
			<CloseIcon/>
		</a>
		<h3 class="text-desktop"> {{ $t( 'donation_page_feedback_box_desktop_content_headline' ) }}</h3>
		<h3 class="text-mobile">{{ $t( 'donation_page_feedback_box_mobile_content_headline' ) }}</h3>
		<p>
			{{ $t( 'donation_page_feedback_box_content_text' ) }}
		</p>

		<div class="button-group has-margin-top-18" >
			<b-button @click="$emit( 'collapse-feedback-box' )"
				class="button is-primary">
				{{ $t( 'donation_page_feedback_box_content_option_decline' ) }}
			</b-button>
			<a :href="$t( 'donation_page_feedback_box_content_survey_link' )"
				target="_blank"
				class="button is-primary">
				{{ $t( 'donation_page_feedback_box_content_option_feedback' ) }}
			</a>
		</div>

	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import CloseIcon from '@/components/pages/donation_form/FeedbackOverlay/CloseIcon.vue';

export default Vue.extend( {
	name: 'FeedbackBoxContent',
	components: { CloseIcon },
	data() {
		return {
			isExpanded: this.$props.isExpanded,
		};
	},
	props: {
		isExpanded: Boolean,
	},
} );
</script>
