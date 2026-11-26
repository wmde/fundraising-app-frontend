<template>
	<span class="submit-values">
		<input type="hidden" name="paymentType" :value="payment.type">
		<input type="hidden" name="interval" :value="payment.interval">
		<input type="hidden" name="amount" :value="payment.amount">

		<input type="hidden" name="iban" :value="bankdata.iban">
		<input type="hidden" name="bic" :value="bankdata.bic">

		<input type="hidden" name="addressType" :value="addressType">

		<template v-if="sendNameAndEmail">
			<input type="hidden" name="salutation" :value="address.salutation">
			<input type="hidden" name="title" :value="address.title">
			<input type="hidden" name="firstName" :value="address.firstName">
			<input type="hidden" name="lastName" :value="address.lastName">
			<input type="hidden" name="email" :value="address.email">
		</template>

		<template v-if="receipt">
			<input type="hidden" name="street" :value="street">
			<input type="hidden" name="postcode" :value="address.postcode">
			<input type="hidden" name="city" :value="address.city">
			<input type="hidden" name="country" :value="address.country">
		</template>

		<input v-if="sendCompanyName" type="hidden" name="companyName" :value="address.companyName">

		<input type="hidden" name="info" :value="newsletter ? '1' : '0'">
		<input type="hidden" name="donationReceipt" :value="receipt ? '1' : '0'">

		<input type="hidden" name="impCount" :value="trackingData.impressionCount">
		<input type="hidden" name="bImpCount" :value="trackingData.bannerImpressionCount">
		<input type="hidden" name="piwik_campaign" :value="campaignValues.campaign">
		<input type="hidden" name="piwik_kwd" :value="campaignValues.keyword">
	</span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';
import type { PaymentValues } from '@src/view_models/Payment';
import type { Address } from '@src/view_models/Address';
import type { BankAccountValues } from '@src/view_models/BankAccount';
import type { TrackingData } from '@src/view_models/TrackingData';
import type { CampaignValues } from '@src/view_models/CampaignValues';
import { clearStreetAndBuildingNumberSeparator } from '@src/util/street_and_building_number_tools';
import { AddressType } from '@src/store/address/constants';

interface Props {
	trackingData?: TrackingData;
	campaignValues?: CampaignValues;
}

defineProps<Props>();

const store = useStore();

const payment = computed( () => store.state.payment.values as PaymentValues );
const address = computed( () => store.state.address.values as Address );
const addressType = computed<AddressType>( () => store.getters[ 'address/addressType' ] );
const bankdata = computed<BankAccountValues>( () => store.state.bankdata.values );
const sendNameAndEmail = computed<boolean>( () => !store.state.address.isAnonymous );
const receipt = computed<boolean>( () => !store.state.address.isAnonymous && store.state.address.receipt );
const sendCompanyName = computed<boolean>( () => receipt.value && store.state.address.isCompany );
const newsletter = computed<boolean>( () => !store.state.address.isAnonymous && store.state.address.newsletter );

const street = computed<string>( () => {
	return clearStreetAndBuildingNumberSeparator( store.state.address.values.street );
} );
</script>
