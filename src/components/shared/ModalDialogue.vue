<template>
	<div class="modal-dialogue" :class="{ 'active': visible }">
		<div class="modal-dialogue-background" @click.prevent="emit( 'hide' )"/>
		<div class="modal-dialogue-content-container">
			<a class="modal-dialogue-close" href="#" @click.prevent="emit( 'hide' )"><CloseIcon/></a>
			<div class="modal-dialogue-scroll">
				<div class="modal-dialogue-content">
					<slot/>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">

import CloseIcon from '@src/components/shared/icons/CloseIcon.vue';

interface Props {
	visible?: boolean;
}

withDefaults( defineProps<Props>(), {
	visible: false,
} );

const emit = defineEmits( [ 'hide' ] );

</script>

<style lang="scss">
@use '@src/scss/settings/global';
@use '@src/scss/settings/units';
@use '@src/scss/settings/colors';
@use '@src/scss/settings/breakpoints';
@use 'sass:map';
@use 'sass:color';

$spacing: map.get( units.$spacing, 'x-large' );

.modal-dialogue {
	position: fixed;
	display: flex;
	align-items: center;
	justify-content: center;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 40;
	overflow: hidden;
	visibility: hidden;
	opacity: 0;
	transition: opacity 500ms global.$easing;

	&.active {
		visibility: visible;
		opacity: 1;

		.modal-dialogue-content-container {
			transform: scale( 1 );
		}
	}

	&-background {
		position: absolute;
		background: rgba( 0, 0, 0, 0.8 );
		height: 100%;
		width: 100%;
	}

	&-content-container {
		position: relative;
		display: flex;
		flex-direction: column;
		background: colors.$white;
		z-index: 41;
		max-height: 100%;
		max-width: 100%;
		transform: scale( 1.1 );
		transition: transform 500ms global.$easing;

		@include breakpoints.tablet-up {
			max-height: calc( 100vh - $spacing );
			max-width: 640px;
		}
	}

	&-scroll {
		flex: 1 1 auto;
		overflow-y: auto;
	}

	&-content {
		padding: map.get( units.$spacing, 'large' );
	}

	&-close {
		position: absolute;
		top: 10px;
		right: 10px;
		z-index: 42;

		svg path {
			fill: colors.$gray-dark;
			transition: fill 500ms;
		}

		&:hover,
		&:focus {
			svg path {
				fill: color.adjust( colors.$gray-dark, $lightness: -20% );
			}
		}
	}
}
</style>
