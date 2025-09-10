<template>
	<div
		class="alert-box flow"
		:data-success="type === 'success' ? true : null"
		:data-warning="type === 'warning' ? true : null"
		:data-error="type === 'error' ? true : null"
		:data-borderless="isBorderless ? true : null"
	>
		<slot/>
	</div>
</template>

<script setup lang="ts">
interface Props {
	type?: 'default' | 'success' | 'warning' | 'error';
	isBorderless?: boolean;
}

withDefaults( defineProps<Props>(), {
	type: 'default',
	isBorderless: false,
} );

</script>
