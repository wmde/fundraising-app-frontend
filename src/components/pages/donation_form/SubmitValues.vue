<template>
	<span class="submit-values">

		<input type="hidden" name="paymentType" :value="payment.type">
		<input type="hidden" name="interval" :value="payment.interval">
		<input type="hidden" name="amount" :value="payment.amount">
		<input type="hidden" name="iban" :value="bankdata.iban">
		<input type="hidden" name="bic" :value="bankdata.bic">

		<input type="hidden" name="addressType" :value="addressType">

		<template v-if="addressType !== 'anonym'">
			<template v-if="addressType !== 'email'">
				<input type="hidden" name="companyName" :value="address.companyName">
				<input type="hidden" name="street" :value="address.street">
				<input type="hidden" name="postcode" :value="address.postcode">
				<input type="hidden" name="city" :value="address.city">
				<input type="hidden" name="country" :value="address.country">
			</template>
			<input type="hidden" name="salutation" :value="address.salutation">
			<input type="hidden" name="title" :value="address.title">
			<input type="hidden" name="firstName" :value="address.firstName">
			<input type="hidden" name="lastName" :value="address.lastName">
			<input type="hidden" name="email" :value="address.email">
		</template>
		<input type="hidden" name="info" :value="newsletter">
		<input type="hidden" name="donationReceipt" :value="receipt">

		<input type="hidden" name="impCount" :value="trackingData.impressionCount">
		<input type="hidden" name="bImpCount" :value="trackingData.bannerImpressionCount">
		<input type="hidden" name="piwik_campaign" :value="campaignValues.campaign">
		<input type="hidden" name="piwik_kwd" :value="campaignValues.keyword">

	</span>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import { NS_ADDRESS, NS_BANKDATA, NS_PAYMENT } from '@/store/namespaces';
import { Payment } from '@/view_models/Payment';
import { AddressState } from '@/view_models/Address';
import { addressTypeName } from '@/view_models/AddressTypeModel';
import { BankAccount } from '@/view_models/BankAccount';
import { TrackingData } from '@/view_models/TrackingData';
import { CampaignValues } from '@/view_models/CampaignValues';
import addressType from '@/components/pages/membership_form/AddressType.vue';

export default Vue.extend( {
	name: 'SubmitValues',
	props: {
		trackingData: Object as () => TrackingData,
		campaignValues: Object as () => CampaignValues,
	},
	computed: {
		addressType() {
			return addressType;
		},
		...mapState<Payment>( NS_PAYMENT, {
			payment: ( state: Payment ) => state.values,
		} ),
		...mapState<AddressState>( NS_ADDRESS, {
			address: ( state: AddressState ) => state.values,
			addressType: ( state: AddressState ) => {
				return addressTypeName( state.addressType );
			},
		} ),
		...mapState<BankAccount>( NS_BANKDATA, {
			bankdata: ( state: BankAccount ) => state.values,
		} ),
		newsletter(): string {
			return this.$store.getters[ NS_ADDRESS + '/willGetNewsletter' ] ? '1' : '0';
		},
		receipt(): string {
			return this.$store.getters[ NS_ADDRESS + '/willGetReceipt' ] ? '1' : '0';
		},
	},
} );
</script>
