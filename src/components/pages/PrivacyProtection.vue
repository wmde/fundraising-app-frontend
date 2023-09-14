<template>
	<div class="privacy_protection">
		<h2 class="title is-size-2">{{ pageTitle }}</h2>
		<div v-html="partialContentFirstHalf" class="has-margin-top-18 static-content"></div>
		<div v-html="partialContentSecondHalf" class="has-margin-top-18 static-content"></div>
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

<style lang="scss">
	@import "../../scss/variables.scss";
	.privacy_protection {
		h3 {
			font-size: 1.4em;
		}
		h4 {
			font-size: 1.2em;
		}
		ul {
			list-style-type: disc;
			padding-left: 20px;
			margin-bottom: 12px;
		}
	}
	.static-content {
		& > ol {
			padding-left: 10px;
			list-style-type: upper-roman;
		}
		p {
			margin: 0 0 11px;
		}
	}
</style>
