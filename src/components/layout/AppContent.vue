<template>
	<div class="app-content">
		<div class="app-content-main">
			<slot name="headline"/>
			<slot name="content"/>
		</div>
		<div v-if="!isFullWidth" class="app-content-sidebar">
			<slot name="sidebar"/>
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
@use '@src/scss/settings/colors';
@use '@src/scss/settings/breakpoints';
@use 'sass:map';

.app-content {
	display: flex;
	flex-direction: column;

	@include breakpoints.tablet-up {
		flex-direction: row;
	}

	&-main,
	&-sidebar {
		margin-bottom: map.get( units.$spacing, 'small' );
	}

	&-main {
		flex: 1 1 auto;
		background: colors.$white;
		padding: map.get( units.$spacing, 'large' );
	}

	&-sidebar {
		@include breakpoints.tablet-up {
			flex: 0 0 33.3333%;
			width: 33.3333%;
			padding: map.get( units.$spacing, 'small' );
		}
	}
}
</style>
