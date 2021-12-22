<template>
	<div className="text-truncator">
		<div
			class="cookie-notice-category-content"
			:class="{ open: textOpen }" >
			<slot></slot>
		</div>
		<a @click="showMoreText" v-if="!textOpen">... <span v-text="$t('cookie_option_more_text')"></span> </a>
		<a @click="showLessText" v-if="textOpen">... <span v-text="$t('cookie_option_less_text')"></span> </a>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend( {
	name: 'TextTruncator',
	data() {
		return {
			textOpen: false,
		};
	},
	methods: {
		showMoreText( e: Event ) {
			e.preventDefault();
			this.textOpen = true;
		},
		showLessText( e: Event ) {
			e.preventDefault();
			this.textOpen = false;
		},
	},
} );
</script>
