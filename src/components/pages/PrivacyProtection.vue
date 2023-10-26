<template>
	<div class="privacy_protection">
		<h1>{{ pageTitle }}</h1>
		<div v-html="partialContentFirstHalf"></div>
		<div v-html="partialContentSecondHalf"></div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent( {
	name: 'PrivacyProtection',
	data: function () {
		const splitContent = this.$props.pageContent.split( '<!-- placeholder_matomo -->' );
		return {
			partialContentFirstHalf: splitContent[ 0 ],
			partialContentSecondHalf: splitContent[ 1 ],
			optOut: 0,
			showOptOutExplanation: 0,
		};
	},
	props: {
		pageId: String,
		pageTitle: String,
		pageContent: String,
	},
} );
</script>
