<template>
	<div class="update-address-confirmation">
		<h1>{{ $t( 'address_change_form_success_title' ) }}</h1>
		<p v-if="donationReceipt === '1'" v-html="$t( 'address_change_form_success_label' )"></p>
		<p v-else v-html="$t( 'address_change_form_success_optout_label' )"></p>
	</div>
</template>

<script setup lang="ts">

defineOptions( {
	name: 'UpdateAddressSuccess',
} );

interface Props {
	donationReceipt: string;
}

defineProps<Props>();

</script>
