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

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import { NS_ADDRESS } from '@/store/namespaces';
import { AddressState } from '@/view_models/Address';
import { addressTypeName } from '@/view_models/AddressTypeModel';

export default Vue.extend( {
	name: 'SubmitValues',
	props: [
		'trackingData',
	],
	computed: {
		...mapState<AddressState>( NS_ADDRESS, {
			address: ( state: AddressState ) => state.values,
			addressType: ( state: AddressState ) => {
				return addressTypeName( state.addressType );
			},
			receipt: ( state: AddressState ) => state.receipt ? '1' : '0',
		} ),
	},
} );
</script>
