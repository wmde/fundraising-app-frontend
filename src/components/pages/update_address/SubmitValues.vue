<template>
	<span class="submit-values">
		<input type="hidden" name="addressType" :value="addressType">
		<input type="hidden" name="salutation" :value="address.salutation">
		<input type="hidden" name="title" :value="address.title">
		<input type="hidden" name="firstName" :value="address.firstName">
		<input type="hidden" name="lastName" :value="address.lastName">
		<input type="hidden" name="company" :value="address.companyName">
		<input type="hidden" name="street" :value="address.street">
		<input type="hidden" name="postcode" :value="address.postcode">
		<input type="hidden" name="city" :value="address.city">
		<input type="hidden" name="country" :value="address.country">
		<input type="hidden" name="receipt" :value="receipt">
	</span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';
import { addressTypeName } from '@src/view_models/AddressTypeModel';
import type { Address } from '@src/view_models/Address';

const store = useStore();

const address = computed( () => store.state.address.values as Address );
const addressType = computed( () => addressTypeName( store.state.address.addressType ) );
const receipt = computed( (): string => store.state.address.receipt ? '1' : '0' );
</script>
