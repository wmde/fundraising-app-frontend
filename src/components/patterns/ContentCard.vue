<template>
	<div class="content-card" :class="{ 'flow' : isFlow }" :data-sidebar-card="isSidebarCard ? true : null" :data-theme="theme" :data-collapsable="isCollapsable ? true : null">
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
	isFlow?: boolean;
	isCollapsable?: boolean;
}

withDefaults( defineProps<Props>(), {
	isFlow: true,
} );

</script>
