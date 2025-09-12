<template>
	<ContentCard>
		<template #heading>
			<h1>{{ pageTitle }}</h1>
		</template>
		<template #content>
			<div v-html="pageContent" class="flow"></div>
		</template>
	</ContentCard>
</template>

<script lang="ts">

import ContentCard from '@src/components/patterns/ContentCard.vue';

export default {
	name: 'StaticPage',
	components: { ContentCard },
	props: {
		pageId: String,
		pageTitle: String,
		pageContent: String,
	},
};
</script>
