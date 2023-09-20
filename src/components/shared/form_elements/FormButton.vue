<template>
	<button
		:class="[ 'form-button', { 'form-button-outlined': isOutlined, 'form-button-loading' : isLoading } ]"
		:type="buttonType"
	>
		<slot/>
	</button>
</template>

<script setup lang="ts">
interface Props {
	buttonType?: 'submit' | 'reset' | 'button',
	isOutlined?: boolean,
	isLoading?: boolean,
}

withDefaults( defineProps<Props>(), {
	buttonType: 'button',
	isOutlined: false,
	isLoading: false,
} );

</script>

<style lang="scss">
@use '@src/scss/settings/forms';
@use '@src/scss/settings/colors';
@use 'sass:color';

.form-button {
	background: colors.$primary;
	color: colors.$white;
	border: 0;
	border-radius: 0;
	padding: 0;
	margin: 0;
	font-size: 1em;
	font-weight: 700;
	height: 54px;
	width: 240px;
	cursor: pointer;

	&:hover {
		background: color.adjust( colors.$primary, $lightness: -5% );
	}

	&-outlined {
		background: colors.$white;
		color: colors.$primary;
		border: 1px solid colors.$primary;

		&:hover {
			background: colors.$primary;
			color: colors.$white;
		}
	}
}

</style>
