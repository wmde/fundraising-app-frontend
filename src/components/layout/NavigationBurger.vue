<template>
	<button
		class="navigation-burger"
		:class="{ 'active': active }"
		aria-controls="main-navigation-items"
		:aria-label="$t( active ? 'aria_navigation_toggle_label_open' : 'aria_navigation_toggle_label_closed' )"
		:aria-expanded="active"
	>
		<span aria-hidden="true"></span>
		<span aria-hidden="true"></span>
		<span aria-hidden="true"></span>
	</button>
</template>

<script setup lang="ts">
interface Props {
	active: boolean
}

defineProps<Props>();

</script>

<style lang="scss">
@use "@src/scss/settings/global";
@use "@src/scss/settings/colors";
@use "@src/scss/settings/breakpoints";

.navigation-burger {
	width: global.$navbar-height;
	position: relative;
	flex-shrink: 0;
	border: 0;
	border-radius: 0;
	background: colors.$white;
	cursor: pointer;

	&:hover,
	&:focus {
		background: colors.$gray-light;
	}

	@include breakpoints.tablet-up {
		display: none;
	}

	span {
		position: absolute;
		height: 2px;
		width: 16px;
		background: colors.$black;
		top: 50%;
		left: 50%;
		margin-left: -8px;
		margin-top: -1px;
		transition: transform 200ms global.$easing, opacity 200ms global.$easing;

		&:first-child {
			margin-top: -6px;
		}

		&:last-child {
			margin-top: 4px;
		}
	}

	&.active {
		span:nth-child( 2 ) {
			opacity: 0;
		}

		span:first-child {
			transform: translateY( 5px ) rotate( 45deg );
		}

		span:last-child {
			transform: translateY( -5px ) rotate( -45deg );
		}
	}
}
</style>
