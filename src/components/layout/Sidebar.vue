<template>
	<aside class="column is-one-third">
		<p><strong>{{ $t('sidebar_getintouch_headline') }}</strong></p>
		<p v-html="$t('sidebar_getintouch_text')"></p>
		<p class="has-margin-top-18">{{ $t('sidebar_getintouch_text_phone') }}</p>
		<feature-toggle>
			<div slot="features.feedback-form">
				<FeedbackBox/>
			</div>
		</feature-toggle>

	</aside>
</template>

<script>
import FeedbackBox from '@/components/pages/donation_form/FeedbackOverlay/FeedbackBox.vue';

export default {
	name: 'Sidebar',
	components: {
		FeedbackBox,
	},
};
</script>
