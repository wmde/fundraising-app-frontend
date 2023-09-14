<template>
	<div class="columns content-wrapper">
		<div v-bind:class="[ isFullWidth ? 'column is-full' : 'is-two-thirds column has-background-bright' ]">
			<slot name="content"/>
		</div>
		<slot v-if="!isFullWidth" name="sidebar"/>
	</div>
</template>

<script setup lang="ts">

interface Props {
	isFullWidth: boolean,
}

defineProps<Props>();

</script>

<style lang="scss">
.columns.content-wrapper {
	margin: 0 -12px;
}
</style>
