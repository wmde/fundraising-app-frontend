<template>
	<div class="donation-confirmation-card exported-donation">
		<IconText>
			<template #icon><WarningIcon/></template>
			<template #content><h2>{{ $t( 'donation_confirmation_exported_title' ) }}</h2></template>
		</IconText>
		<p>
			{{ $t( 'donation_confirmation_exported_content' ) }}
		</p>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import WarningIcon from '@src/components/shared/icons/WarningIcon.vue';
import IconText from '@src/components/patterns/IconText.vue';

export default defineComponent( {
	name: 'DonationExported',
	components: { IconText, WarningIcon },
	props: {
		addressType: String,
	},
} );

</script>
