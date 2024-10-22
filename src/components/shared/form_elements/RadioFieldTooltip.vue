<template>
	<span class="radio-field-tooltip">
		<InfoIcon/>
		<span :id="textId" class="radio-field-tooltip-text">
			<slot/>
		</span>
		<span class="is-sr-only"><slot/></span>
	</span>
</template>

<script setup lang="ts">

import InfoIcon from '@src/components/shared/icons/InfoIcon.vue';

interface Props {
	textId?: string;
}

defineProps<Props>();

</script>

<style lang="scss">
@use '@src/scss/settings/colors';

.radio-field-tooltip {
	position: absolute;
	display: block;
	left: 14px;
	top: 50%;
	margin-top: -8px;
	height: 16px;
	width: 17px;
	background: colors.$white;

	&-text {
		position: absolute;
		display: block;
		visibility: hidden;
		opacity: 0;
		height: 60px;
		width: 280px;
		top: -70px;
		left: -8px;
		background: colors.$white;
		padding: 10px;
		border: 1px solid colors.$gray-dark;
		border-radius: 2px;
		color: rgba(0, 0, 0, .6);
		box-shadow: 0 0 4px rgb( 0 0 0 / 10% );
		transition: visibility 200ms, opacity 200ms ease-in-out;

		&:before {
			content: '';
			position: absolute;
			bottom: -9px;
			left: 6px;
			width: 0;
			height: 0;
			border-style: solid;
			border-width: 9px 10px 0 9px;
			border-color: colors.$gray-mid transparent transparent transparent;
		}

		&:after {
			content: '';
			position: absolute;
			bottom: -7px;
			left: 8px;
			width: 0;
			height: 0;
			border-style: solid;
			border-width: 8px 8px 0 8px;
			border-color: colors.$white transparent transparent transparent;
		}
	}
}

</style>
