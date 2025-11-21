<template>
	<div
		class="callout"
		:data-success="type === 'success' ? true : null"
		:data-warning="type === 'warning' ? true : null"
		:data-error="type === 'error' ? true : null"
		:data-neutral="type === 'neutral' ? true : null"
		:data-transparent="type === 'transparent' ? true : null"
		:data-borderless="isBorderless ? true : null"
		:data-action="hasAction ? true : null"
	>
		<slot/>
	</div>
</template>

<script setup lang="ts">
interface Props {
	type?: 'default' | 'success' | 'warning' | 'error' | 'neutral' | 'transparent';
	isBorderless?: boolean;
	hasAction?: boolean;
}

withDefaults( defineProps<Props>(), {
	type: 'default',
	isBorderless: false,
	hasAction: false,
} );

</script>
