<template>
	<div class="donation-confirmation-card anonymous-address has-background-bright has-padding-36 mb-4">
		<h2 class="title icon-title is-size-5 has-margin-bottom-18"><warning-icon/>{{ $t( 'donation_confirmation_cta_title_alt' ) }}</h2>
		<p class="has-margin-bottom-18">{{ $t( 'donation_confirmation_cta_summary_alt' ) }}</p>
		<b-button
			id="address-change-button"
			class="address-change-button "
			@click="$emit( 'show-address-modal' )"
			type="is-primary is-full-width"
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
