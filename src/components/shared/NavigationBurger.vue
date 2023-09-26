<template>
	<a
		class="navigation-burger"
		:class="{ 'active': active }"
		role="button"
		aria-label="menu"
		aria-expanded="false"
	>
		<span aria-hidden="true"></span>
		<span aria-hidden="true"></span>
		<span aria-hidden="true"></span>
	</a>
</template>

<script setup lang="ts">
interface Props {
	active: boolean
}

defineProps<Props>();

</script>

<style scoped lang="scss">
@use "../../scss/settings/global";
@use "../../scss/settings/colors";
@use "../../scss/settings/breakpoints";

.navigation-burger {
	width: global.$navbar-height;
	position: relative;
	flex-shrink: 0;

	&:hover {
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
