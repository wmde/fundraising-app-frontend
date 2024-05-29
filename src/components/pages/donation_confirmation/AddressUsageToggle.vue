<template>
	<details class="address-usage-toggle">
		<summary class="address-usage-toggle-link">{{ $t( 'donation_confirmation_address_usage_link' ) }}</summary>
		<div class="address-usage-toggle-content" v-html="$t( 'donation_confirmation_address_usage_content' )"/>
	</details>
</template>

<style lang="scss">
@use "@src/scss/settings/colors";

.address-usage-toggle {
	&-link {
		color: colors.$black;
		position: relative;
		padding-left: 24px;
		padding-top: 5px;
		cursor: pointer;
		font-size: 12px;
		list-style-type: none;

		&::-webkit-details-marker {
			display: none;
		}

		&:hover {
			text-decoration: underline;
			color: colors.$primary;
		}

		&::after {
			border: 2px solid colors.$primary;
			border-radius: 2px;
			border-right: 0;
			border-top: 0;
			content: ' ';
			display: block;
			margin-top: -0.6em;
			pointer-events: none;
			position: absolute;
			top: 50%;
			left: 5px;
			transform: rotate(-45deg);
			transform-origin: center;
			height: 1em;
			width: 1em;

			transition: transform 100ms, margin-top 100ms;
		}
	}

	&-content {
		font-size: 14px;
	}

	&[open] {
		.address-usage-toggle-link::after {
			transform: rotate(135deg);
			margin-top: -0.3em;
		}

		.address-usage-toggle-content {
			display: block;
		}
	}
}
</style>
