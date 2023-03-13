<template>
	<div class="donation-confirmation-card exported-donation has-background-bright mb-4">
		<h2 class="icon-title is-size-5 has-margin-bottom-18">
			<warning-icon/> {{ $t( 'donation_confirmation_exported_title' ) }}
		</h2>
		<p>
			{{ $t( 'donation_confirmation_exported_content' ) }}
		</p>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import WarningIcon from '@/components/shared/icons/WarningIcon.vue';

export default Vue.extend( {
	name: 'DonationExported',
	components: { WarningIcon },
	props: {
		addressType: String,
	},
} );

</script>

<style lang="scss">

</style>
