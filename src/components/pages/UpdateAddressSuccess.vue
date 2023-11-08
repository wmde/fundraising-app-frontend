<template>
	<div class="update-address-confirmation">
		<h1>{{ $t( 'address_change_form_success_title' ) }}</h1>
		<p v-if="donationReceipt === '1'">{{ $t( 'address_change_form_success_label' ) }}</p>
		<p v-else>{{ $t( 'address_change_form_success_optout_label_vuei18n_v3' ) }}</p>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent( {
	name: 'UpdateAddressSuccess',
	props: [
		'donationReceipt',
	],
} );
</script>
