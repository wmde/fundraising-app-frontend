<template>
	<div class="app-content">
		<div class="app-content-main" :class="{ 'uses-cards': usesContentCards }">
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
	usesContentCards: boolean,
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

	h1 {
		color: #000000;
		font-size: 1.7rem;
		font-weight: 400;
		line-height: 1.125;
		margin-bottom: map.get( units.$spacing, 'small' );
	}

	p {
		margin-bottom: map.get( units.$spacing, 'small' );
	}

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

		&.uses-cards {
			background: transparent;
			padding: map.get( units.$spacing, 'small' ) 0;
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
