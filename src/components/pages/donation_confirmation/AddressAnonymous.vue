<template>
	<div class="donation-confirmation-card has-background-bright has-padding-36 mb-4">
		<div class="has-margin-bottom-18">
			<h2 class="title icon-title is-size-5"><warning-icon/>{{ $t( 'donation_confirmation_cta_title_alt' ) }}</h2>
		</div>
		<p class="has-margin-bottom-18">{{ $t( 'donation_confirmation_cta_summary_alt' ) }}</p>
		<b-button
			id="address-change-button"
			class="address-change-button "
			@click="$emit( 'show-address-modal' )"
			type="is-primary is-main"
			outlined
		>
			{{ $t( 'donation_confirmation_address_update_button_alt' ) }}
		</b-button>
		<address-usage-toggle/>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import AddressUsageToggle from '@/components/pages/donation_confirmation/AddressUsageToggle.vue';
import WarningIcon from '@/components/shared/icons/WarningIcon.vue';

export default Vue.extend( {
	name: 'AddressAnonymous',
	components: {
		WarningIcon,
		AddressUsageToggle,
	},
} );
</script>

<style lang="scss">
button.is-main {
	width: 100%;
}
.icon-title svg {
	margin-right: 12px;
	margin-top: -1px;
}
</style>
