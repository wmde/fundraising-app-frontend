<template>
	<div class="call-to-action">
		<a href="https://spenden.wikimedia.de">{{ text }}</a>
	</div>
</template>

<script setup lang="ts">
interface Props {
	text: string;
}

defineProps<Props>();

</script>

<style lang="scss">
@use '@src/scss/settings/colors';
@use '@src/scss/settings/units';
@use '@src/scss/settings/breakpoints';
@use "sass:color";
@use "sass:map";

.call-to-action {
	text-align: center;
	margin-bottom: map.get( units.$spacing, 'small' );

	@include breakpoints.tablet-up {
		margin-bottom: map.get( units.$spacing, 'large' );
	}

	a {
		padding: map.get( units.$spacing, 'small' ) map.get( units.$spacing, 'large' );
		border: 0;
		border-radius: 5px;
		background: var( --call-to-action-background );
		color: var( --call-to-action-color );
		font-size: 18px;
		font-weight: bold;
		cursor: pointer;
		display: inline-block;
		&:hover,
		&:focus {
			color: var( --call-to-action-color );
			background: var( --call-to-action-background-hover );
			text-decoration: none;
		}
	}
}
</style>
