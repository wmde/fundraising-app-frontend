<template>
	<div class="form-summary-content">
		<slot name="title"/>
		<p v-if="addressIsInvalid">{{ $t( 'membership_form_review_address_is_invalid' ) }}</p>
		<p v-else v-html="$t( 'membership_confirmation_data_text', summaryData )"/>
		<slot name="content"/>
	</div>
</template>

<script setup lang="ts">

import { YearlyMembershipFee } from '@src/view_models/MembershipFee';
import { Salutation } from '@src/view_models/Salutation';
import { useI18n } from 'vue-i18n';
import { MembershipAddress } from '@src/Domain/Membership/MembershipAddress';
import { MembershipApplication } from '@src/Domain/Membership/MembershipApplication';
import { computed } from 'vue';

interface Props {
	address: MembershipAddress;
	membershipApplication: MembershipApplication;
	salutations: Salutation[];
	addressIsInvalid: boolean;
}

const props = defineProps<Props>();

const { t, n } = useI18n();

const renderAmount = ( amount: number, interval: number, intervalTranslation: String ): string => {
	if ( interval === 12 ) {
		return '';
	}
	const formattedAmount = n( amount, { key: 'currency', currencyDisplay: 'name' } );
	return `(${formattedAmount} ${intervalTranslation})`;
};

const renderSalutation = (): string => {
	if ( !props.address.salutation ) {
		return '';
	}

	const salutationObject = props.salutations.find( salutation => salutation.label === props.address.salutation );
	if ( salutationObject === undefined ) {
		return '';
	}
	return salutationObject?.display + ' ';
};

const renderAddress = ( address: MembershipAddress, countryName: string, salutation: string ): string => {
	if ( address.applicantType === 'person' ) {
		return salutation + address.fullName + ', '
			+ address.streetAddress + ', ' + address.postalCode + ' ' + address.city + ', ' + countryName
			+ ' <p>E-Mail: ' + address.email + '</p>';
	}

	return address.fullName + ', '
		+ address.streetAddress + ', ' + address.postalCode + ' ' + address.city + ', ' + countryName
		+ ' <p>E-Mail: ' + address.email + '</p>';
};

const summaryData = computed( () => {
	const yearlyFee = new YearlyMembershipFee( props.membershipApplication.paymentIntervalInMonths, props.membershipApplication.membershipFee );
	return {
		paymentInterval: t( 'donation_form_payment_interval_' + props.membershipApplication.paymentIntervalInMonths ),
		membershipType: t( props.membershipApplication.membershipType === 'active' ? 'membership_type_active' : 'membership_type_sustaining' ),
		membershipFeeFormatted: n( yearlyFee.membershipFeePerInterval, { key: 'currency', currencyDisplay: 'name' } ),
		membershipFeeYearlyFormatted: renderAmount(
			yearlyFee.yearlyFee,
			yearlyFee.paymentIntervalInMonths,
			t( 'donation_form_payment_interval_12' )
		),
		paymentType: t( props.membershipApplication.paymentType ),
		address: renderAddress(
			props.address,
			t( 'donation_form_country_option_' + props.address.countryCode ),
			renderSalutation()
		),
	};
} );

</script>
