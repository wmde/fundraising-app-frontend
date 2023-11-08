<template>
	<div class="donation-confirmation-card exported-donation">
		<h2 class="icon-title">
			<WarningIcon/> {{ $t( 'donation_confirmation_exported_title' ) }}
		</h2>
		<p>
			{{ $t( 'donation_confirmation_exported_content' ) }}
		</p>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import WarningIcon from '@src/components/shared/icons/WarningIcon.vue';

export default defineComponent( {
	name: 'DonationExported',
	components: { WarningIcon },
	props: {
		addressType: String,
	},
} );

</script>
