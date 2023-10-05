<template>
	<div class="app-content">
		<div class="app-content-main">
			<slot name="content"/>
		</div>
		<aside v-if="!isFullWidth" class="app-content-sidebar">
			<slot name="sidebar"/>
		</aside>
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
@use '@src/scss/settings/global';
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
		padding: map.get( units.$spacing, 'small' );

		@include breakpoints.tablet-up {
			padding: map.get( units.$spacing, 'large' );
		}
	}

	&-sidebar {
		@include breakpoints.tablet-up {
			flex: 0 0 global.$sidebar-width;
			width: global.$sidebar-width;
		}
	}
}
</style>
