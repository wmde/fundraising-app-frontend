<template>
	<div class="form-summary">
		<slot name="summary-content"/>
		<div class="form-summary-buttons">
			<slot name="summary-buttons"/>
		</div>
		<slot name="summary-notice"/>
	</div>
</template>

<style lang="scss">
@use '@src/scss/settings/forms';
@use '@src/scss/settings/colors';
@use '@src/scss/settings/units';
@use '@src/scss/settings/breakpoints';
@use 'sass:map';

.form-summary {
	border: 2px solid colors.$gray-light;
	padding: map.get( units.$spacing, 'xx-small' );
	margin: 0;

	@include breakpoints.tablet-up {
		padding: map.get( units.$spacing, 'small' );
		margin: 0 ( -( map.get( units.$spacing, 'small' ) ) );
	}

	&-content {
		margin: 0 0 map.get( units.$spacing, 'small' );
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

			@include breakpoints.tablet-up {
				margin: 0 map.get( units.$spacing, 'small' );
			}
		}
	}
}

</style>
