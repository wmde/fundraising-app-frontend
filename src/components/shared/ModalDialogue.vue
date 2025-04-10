<template>
	<dialog :id="id" class="modal-dialogue" ref="dialog">
		<div class="modal-dialogue-content-container">
			<div class="modal-dialogue-title">
				{{ title }}
				<button class="modal-dialogue-close" @click.prevent="emit( 'hide' )">
					<span class="is-sr-only">{{ $t( 'close' ) }}</span>
					<CloseIcon/>
				</button>
			</div>
			<div class="modal-dialogue-scroll">
				<div class="modal-dialogue-content">
					<slot/>
				</div>
			</div>
		</div>
	</dialog>
</template>

<script setup lang="ts">

import CloseIcon from '@src/components/shared/icons/CloseIcon.vue';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { ModalStates, useModalState } from '@src/components/shared/composables/useModalState';

interface Props {
	id?: string;
	visible?: boolean;
	title: String;
}

const props = withDefaults( defineProps<Props>(), {
	visible: false,
} );

const emit = defineEmits( [ 'hide' ] );
const dialog = ref<HTMLDialogElement>();
const modalState = useModalState();

watch( () => props.visible, ( newVisible: boolean ) => {
	if ( newVisible ) {
		dialog.value.showModal();
		modalState.value = ModalStates.Open;
	} else {
		dialog.value.close();
		modalState.value = ModalStates.Closed;
	}
} );

const onNativeClose = (): void => emit( 'hide' );
onMounted( () => dialog.value.addEventListener( 'close', onNativeClose ) );
onUnmounted( () => dialog.value.removeEventListener( 'close', onNativeClose ) );

</script>

<style lang="scss">
@use '@src/scss/settings/global';
@use '@src/scss/settings/units';
@use '@src/scss/settings/colors';
@use '@src/scss/settings/breakpoints';
@use 'sass:map';
@use 'sass:color';

$spacing: map.get( units.$spacing, 'x-large' );
$title-height: map.get( units.$spacing, 'xx-large' );
$title-height-large: map.get( units.$spacing, 'xxx-large' );

@keyframes fade-in {
	0% {
		opacity: 0;
		transform: scale( 1.1 );
		display: none;
	}

	100% {
		opacity: 1;
		transform: scale( 1 );
		display: block;
	}

}

@keyframes fade-out {
	0% {
		opacity: 1;
		transform: scale( 1.1 );
		display: block;
	}

	100% {
		opacity: 0;
		transform: scale( 0 );
		display: none;
	}
}

@keyframes backdrop-fade-in {
	0% {
		background-color: rgb( 0 0 0 / 0% );
	}

	100% {
		background-color: rgb( 0 0 0 / 80% );
	}
}

.modal-dialogue {
	border: 0;
	padding: 0;
	max-width: 100%;
	max-height: 100%;
	height: fit-content;
	box-sizing: border-box;
	overflow: hidden;
	animation: fade-out 500ms global.$easing;

	@media (prefers-reduced-motion) {
		animation-duration: 0ms;
	}

	&[open] {
		animation: fade-in 500ms global.$easing;

		@media (prefers-reduced-motion) {
			animation-duration: 0ms;
		}
	}

	&::backdrop {
		background-color: rgb( 0 0 0 / 80% );
	}

	@include breakpoints.tablet-up {
		margin: auto;
		max-height: calc( 100vh - $spacing );
		max-width: 640px;
	}

	&-content-container {
		position: relative;
		padding-top: $title-height;
		display: flex;
		flex-direction: column;
		background: colors.$white;
		max-height: 100vh;

		@include breakpoints.tablet-up {
			max-height: calc( 100vh - $spacing );
			padding-top: $title-height-large;
		}
	}

	&-scroll {
		flex: 1 1 auto;
		overflow-y: auto;
	}

	&-content {
		padding: map.get( units.$spacing, 'large' );
	}

	&-title {
		position: absolute;
		top: 0;
		height: $title-height;
		width: 100%;
		line-height: $title-height;
		display: flex;
		align-content: space-between;
		justify-content: space-between;
		padding-left: map.get( units.$spacing, 'large' );
		border-bottom: 1px solid colors.$gray-light;
		z-index: 42;
		font-size: 18px;
		white-space: nowrap;

		@include breakpoints.tablet-up {
			height: $title-height-large;
			line-height: $title-height-large;
			font-size: 25px;
		}
	}

	&-close {
		padding: 4px 0 0;
		width: $title-height;
		cursor: pointer;
		border: 0;
		background: none;
		transition: background 500ms;

		@include breakpoints.tablet-up {
			width: $title-height-large;
		}

		svg path {
			fill: colors.$gray-dark;
			transition: fill 500ms;
		}

		&:hover,
		&:focus {
			background: colors.$gray-light;

			svg path {
				fill: color.adjust( colors.$gray-dark, $lightness: -20% );
			}
		}
	}
}
</style>
