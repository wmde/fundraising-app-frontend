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

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';
import type { MembershipAddressState } from '@src/view_models/Address';
import { addressTypeName } from '@src/view_models/AddressTypeModel';
import type { BankAccount } from '@src/view_models/BankAccount';
import { membershipTypeName } from '@src/view_models/MembershipTypeModel';
import type { TrackingData } from '@src/view_models/TrackingData';
import type { CampaignValues } from '@src/view_models/CampaignValues';
import type { MembershipFee } from '@src/view_models/MembershipFee';

export default defineComponent( {
	name: 'SubmitValues',
	props: {
		trackingData: Object as () => TrackingData,
		campaignValues: Object as () => CampaignValues,
	},
	computed: {
		...mapState<MembershipFee>( 'membership_fee', {
			fee: ( state: MembershipFee ) => state.values,
		} ),
		...mapState<MembershipAddressState>( 'membership_address', {
			address: ( state: MembershipAddressState ) => state.values,
			addressType: ( state: MembershipAddressState ) => {
				return addressTypeName( state.addressType );
			},
			receipt: ( state: MembershipAddressState ) => state.receipt ? '1' : '0',
			incentives: ( state: MembershipAddressState ) => state.incentives,
			membershipType: ( state: MembershipAddressState ) => membershipTypeName( state.membershipType ),
			formattedDateOfBirth: ( state: MembershipAddressState ) => {
				return state.values.date.replaceAll( '/', '-' );
			},
		} ),
		...mapState( 'bankdata', {
			bankdata: ( state: any ) => ( state as BankAccount ).values,
		} ),
	},
} );
</script>
