<template>
	<span class="submit-values">

		<input type="hidden" name="membership_type" :value="membershipType">

		<input type="hidden" name="payment_type" :value="fee.type">
		<input type="hidden" name="membership_fee_interval" :value="fee.interval">
		<input type="hidden" name="membership_fee" :value="fee.fee">
		<input type="hidden" name="iban" :value="bankdata.iban">
		<input type="hidden" name="bic" :value="bankdata.bic">

		<input type="hidden" name="adresstyp" :value="addressType">

		<input type="hidden" name="anrede" :value="address.salutation">
		<input type="hidden" name="titel" :value="address.title">
		<input type="hidden" name="vorname" :value="address.firstName">
		<input type="hidden" name="nachname" :value="address.lastName">
		<input type="hidden" name="firma" :value="address.companyName">
		<input type="hidden" name="strasse" :value="address.street">
		<input type="hidden" name="postcode" :value="address.postcode">
		<input type="hidden" name="ort" :value="address.city">
		<input type="hidden" name="country" :value="address.country">
		<input type="hidden" name="email" :value="address.email">
		<input type="hidden" name="donationReceipt" :value="receipt">
		<input type="hidden" name="dob" :value="formattedDateOfBirth">
		<input type="hidden" name="incentives[]" :value="incentives">
		<input type="hidden" name="impCount" :value="trackingData.impressionCount">
		<input type="hidden" name="bImpCount" :value="trackingData.bannerImpressionCount">
		<input type="hidden" name="piwik_campaign" :value="campaignValues.campaign">
		<input type="hidden" name="piwik_kwd" :value="campaignValues.keyword">

	</span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';
import type { Address } from '@src/view_models/Address';
import { addressTypeName } from '@src/view_models/AddressTypeModel';
import type { BankAccountValues } from '@src/view_models/BankAccount';
import type { TrackingData } from '@src/view_models/TrackingData';
import type { CampaignValues } from '@src/view_models/CampaignValues';
import type { MembershipFeeValues } from '@src/view_models/MembershipFee';
import { membershipTypeName } from '@src/view_models/MembershipTypeModel';

interface Props {
	trackingData: TrackingData;
	campaignValues: CampaignValues;
}

defineProps<Props>();

const store = useStore();

const fee = computed( () => store.state.membership_fee.values as MembershipFeeValues );
const address = computed( () => store.state.membership_address.values as Address );
const addressType = computed( () => addressTypeName( store.state.membership_address.addressType ) );
const membershipType = computed( () => membershipTypeName( store.state.membership_address.membershipType ) );
const receipt = computed( () => store.state.membership_address.receipt ? '1' : '0' );
const incentives = computed( () => store.state.membership_address.incentives );
const formattedDateOfBirth = computed( () => ( store.state.membership_address.values.date ?? '' ).replaceAll( '/', '.' ) );
const bankdata = computed( () => store.state.bankdata.values as BankAccountValues );

</script>
