<template>
	<button
		class="link-button"
		type="button"
		@click.prevent="$emit( 'click' )"
		:aria-controls="ariaControls"
		:aria-expanded="ariaExpanded"
	>
		<slot/>
	</button>
</template>

<script setup lang="ts">
/**
 * Use this when a button is required for accessibility (for example to open a modal) but it needs to be styled like a link.
 */

interface Props {
	ariaControls?: string;
	ariaExpanded?: boolean;
}

withDefaults( defineProps<Props>(), {
	ariaExpanded: false,
} );

defineEmits( [ 'click' ] );

</script>

<style lang="scss">
@use '@src/scss/settings/colors';

.button-link {
	display: inline;
	background: transparent;
	border: 0;
	cursor: pointer;
	color: colors.$primary;

	&:hover,
	&:focus {
		text-decoration: underline;
		color: colors.$black;
	}
}

</style>
