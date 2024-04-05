<template>
	<div class="update-address-confirmation">
		<h1>{{ $t( 'address_change_form_success_title' ) }}</h1>
		<p v-if="donationReceipt === '1'">{{ $t( 'address_change_form_success_label' ) }}</p>
		<p v-else>{{ $t( 'address_change_form_success_optout_label' ) }}</p>
	</div>
</template>

<script setup lang="ts">

defineOptions( {
	name: 'UpdateAddressSuccess',
} );

interface Props {
	donationReceipt;
}

defineProps<Props>();

</script>
