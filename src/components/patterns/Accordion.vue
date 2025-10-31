<template>
	<div class="accordion flow" :data-theme="theme">
		<slot/>
	</div>
</template>

<script setup lang="ts">

interface Props {
	theme?: string;
}

defineProps<Props>();

</script>
