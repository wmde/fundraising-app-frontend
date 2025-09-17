<template>
	<div class="donation-confirmation-card anonymous-address">
		<IconText>
			<template #icon><WarningIcon/></template>
			<template #content><h2>{{ $t( 'donation_confirmation_cta_title_alt' ) }}</h2></template>
		</IconText>
		<p>{{ $t( 'donation_confirmation_cta_summary_alt' ) }}</p>
		<FormButton
			id="address-change-button"
			:is-outlined="true"
			aria-controls="address-change-modal"
			:aria-expanded="modalIsVisible"
			@click="$emit( 'show-address-modal' )"
		>
			{{ $t( 'donation_confirmation_address_update_button_alt' ) }}
		</FormButton>
		<AddressUsageToggle/>
	</div>
</template>

<script setup lang="ts">
import AddressUsageToggle from '@src/components/pages/donation_confirmation/AddressUsageToggle.vue';
import WarningIcon from '@src/components/shared/icons/WarningIcon.vue';
import FormButton from '@src/components/shared/form_elements/FormButton.vue';
import IconText from '@src/components/patterns/IconText.vue';

interface Props {
	modalIsVisible: boolean;
}

defineProps<Props>();

</script>

<style lang="scss">
.anonymous-address {
	button {
		width: 100%;
	}
}
</style>
