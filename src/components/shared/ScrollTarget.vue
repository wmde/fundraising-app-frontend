<template>
	<div class="scroll-target">
		<div :id="targetId"/>
	</div>
</template>

<script setup lang="ts">
interface Props {
	targetId: string;
}

defineProps<Props>();

</script>

<style lang="scss">
	.scroll-target {
		position: relative;
		height: 0;
		width: 0;

		>div {
			position: absolute;
			height: 0;
			width: 0;
			top: -80px;
		}
	}
</style>
