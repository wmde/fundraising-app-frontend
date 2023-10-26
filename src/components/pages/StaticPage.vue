<template>
	<div class="static-page">
		<h1>{{ pageTitle }}</h1>
		<div v-html="pageContent" class="static-content"></div>
	</div>
</template>

<script lang="ts">

export default {
	name: 'StaticPage',
	props: {
		pageId: String,
		pageTitle: String,
		pageContent: String,
	},
};
</script>
