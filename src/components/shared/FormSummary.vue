<template>
	<div class="form-summary">
		<slot name="summary-content"/>
		<div class="form-summary-buttons">
			<slot name="summary-buttons"/>
		</div>
		<slot name="summary-notice"/>
	</div>
</template>

<script setup lang="ts">

interface Props {
	showBorder?: boolean;
}

withDefaults( defineProps<Props>(), {
	showBorder: true,
} );

</script>

<style lang="scss">
@use '@src/scss/settings/forms';
@use '@src/scss/settings/colors';
@use '@src/scss/settings/units';
@use '@src/scss/settings/breakpoints';
@use 'sass:map';

.form-summary {

	margin: 0;

	&-content {
		margin: 0 0 map.get( units.$spacing, 'small' );
	}

	>*:last-child {
		margin-bottom: 0;
	}

	&-buttons {
		margin: 0;

		@include breakpoints.tablet-up {
			margin: 0 ( -( map.get( units.$spacing, 'small' ) ) ) map.get( units.$spacing, 'small' );
			display: flex;
		}

		.form-button {
			margin: 0 0 map.get( units.$spacing, 'small' );
			width: 100%;

			&:last-child {
				margin-bottom: 0;
			}

			@include breakpoints.tablet-up {
				margin: 0 map.get( units.$spacing, 'small' );
			}
		}
	}
}

</style>
