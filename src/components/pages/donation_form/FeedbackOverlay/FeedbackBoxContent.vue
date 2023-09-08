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
			<FunButton @click="$emit( 'collapse-feedback-box' )" class="button is-primary">
				{{ $t( 'donation_page_feedback_box_content_option_decline' ) }}
			</FunButton>
			<a :href="$t( 'donation_page_feedback_box_content_survey_link' )"
				target="_blank"
				class="button is-primary">
				{{ $t( 'donation_page_feedback_box_content_option_feedback' ) }}
			</a>
		</div>

	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CloseIcon from '@src/components/pages/donation_form/FeedbackOverlay/CloseIcon.vue';
import FunButton from '@src/components/shared/legacy_form_inputs/FunButton.vue';

export default defineComponent( {
	name: 'FeedbackBoxContent',
	components: { FunButton, CloseIcon },
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
