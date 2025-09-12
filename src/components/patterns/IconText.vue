<template>
	<div class="icon-text" :data-small-heading="isSmallHeading ? true : null">
		<div class="icon-text__icon" aria-hidden="true"><slot name="icon"/></div><slot name="content"/>
	</div>
</template>

<script setup lang="ts">
interface Props {
	isSmallHeading?: boolean;
}
defineProps<Props>();
</script>
