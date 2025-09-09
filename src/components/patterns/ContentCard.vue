<template>
	<div class="content-card flow" :data-sidebar-card="isSidebarCard ? true : null" :data-theme="theme">
		<SectionHeading v-if="$slots.heading">
			<slot name="heading"/>
		</SectionHeading>
		<slot name="content"/>
	</div>
</template>
<script setup lang="ts">

import SectionHeading from '@src/components/patterns/SectionHeading.vue';

interface Props {
	theme?: string;
	isSidebarCard?: boolean;
}

defineProps<Props>();

</script>
