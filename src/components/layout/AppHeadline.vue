<template>
	<div class="app-headline" :class="{ 'full-width': isFullWidth }">
		<div class="app-headline-text">
			{{ $t('header_headline_text') }}
		</div>
	</div>
</template>

<script setup lang="ts">

interface Props {
	isFullWidth: boolean,
}

defineProps<Props>();

</script>

<style lang="scss">
@use '@src/scss/settings/units';
@use '@src/scss/settings/breakpoints';
@use 'sass:map';

.app-headline {

	@include breakpoints.tablet-up {
		padding-right: 33.3333%;

		&.full-width {
			padding-right: 0;
		}
	}

	&-text {
		padding: map.get( units.$spacing, 'small' );

		@include breakpoints.tablet-up {
			padding: map.get( units.$spacing, 'small' ) 0;
		}
	}
}
</style>
