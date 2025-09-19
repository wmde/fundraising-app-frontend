<template>
	<div class="accordion" :data-theme="theme">
		<slot/>
	</div>
</template>

<script setup lang="ts">

interface Props {
	theme?: string;
}

defineProps<Props>();

</script>
