<template>
	<div class="donation-confirmation-card has-background-bright has-padding-18 mb-4">
		<p class="has-margin-bottom-18"><donor-icon/> <strong>{{ $t( 'donation_confirmation_survey_title' ) }}</strong></p>
		<p class="has-margin-bottom-18">{{ $t( 'donation_confirmation_survey_content' ) }}</p>
		<p><a href="#">{{ $t( 'donation_confirmation_survey_link' ) }}</a></p>
	</div>
</template>

<script>
import Vue from 'vue';
import DonorIcon from '@/components/shared/icons/DonorIcon.vue';

export default Vue.extend( {
	name: 'Survey',
	components: {
		DonorIcon,
	},
} );
</script>
