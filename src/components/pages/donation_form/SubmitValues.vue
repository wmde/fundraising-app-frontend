<template>
	<span class="submit-values">
		<input type="hidden" name="paymentType" :value="payment.type">
		<input type="hidden" name="interval" :value="payment.interval">
		<input type="hidden" name="amount" :value="payment.amount">

		<input type="hidden" name="iban" :value="bankdata.accountNumber">
		<input type="hidden" name="bic" :value="bankdata.bankCode">

		<input type="hidden" name="addressType" :value="addressType">

		<template v-if="sendNameAndEmail">
			<input type="hidden" name="salutation" :value="address.salutation">
			<input type="hidden" name="title" :value="address.title">
			<input type="hidden" name="firstName" :value="address.firstName">
			<input type="hidden" name="lastName" :value="address.lastName">
			<input type="hidden" name="email" :value="address.email">
		</template>

		<template v-if="sendPostalAddress">
			<input type="hidden" name="street" :value="address.street">
			<input type="hidden" name="postcode" :value="address.postcode">
			<input type="hidden" name="city" :value="address.city">
			<input type="hidden" name="country" :value="address.country">
		</template>

		<input type="hidden" name="companyName" :value="address.companyName">

		<input type="hidden" name="info" :value="newsletter">
		<input type="hidden" name="donationReceipt" :value="receipt">
		<input type="hidden" name="impCount" :value="trackingData.impressionCount">
		<input type="hidden" name="bImpCount" :value="trackingData.bannerImpressionCount">
		<input type="hidden" name="piwik_campaign" :value="campaignValues.campaign">
		<input type="hidden" name="piwik_kwd" :value="campaignValues.keyword">
	</span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';
import { Payment } from '@src/view_models/Payment';
import { AddressState } from '@src/view_models/Address';
import { addressTypeName } from '@src/view_models/AddressTypeModel';
import { BankAccount } from '@src/view_models/BankAccount';
import { TrackingData } from '@src/view_models/TrackingData';
import { CampaignValues } from '@src/view_models/CampaignValues';

export default defineComponent( {
	name: 'SubmitValues',
	props: {
		trackingData: Object as () => TrackingData,
		campaignValues: Object as () => CampaignValues,
	},
	computed: {
		...mapState<Payment>( 'payment', {
			payment: ( state: Payment ) => state.values,
		} ),
		...mapState<AddressState>( 'address', {
			address: ( state: AddressState ) => state.values,
			addressType: ( state: AddressState ) => {
				return addressTypeName( state.addressType );
			},
		} ),
		...mapState<BankAccount>( 'bankdata', {
			bankdata: ( state: BankAccount ) => state.values,
		} ),
		sendPostalAddress(): boolean {
			return this.addressType !== 'anonym' && this.addressType !== 'email';
		},
		sendNameAndEmail(): boolean {
			return this.addressType !== 'anonym';
		},
		newsletter(): string {
			return this.$store.getters[ 'address/willGetNewsletter' ] ? '1' : '0';
		},
		receipt(): string {
			return this.$store.getters[ 'address/willGetReceipt' ] ? '1' : '0';
		},
	},
} );
</script>
