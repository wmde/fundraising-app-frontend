<template>
	<p>
		{{ $t( 'membership_form_summary_thanks_headline' ) }} <br/>
		<span v-html="$t( 'membership_form_summary_headline', summaryData )"></span>
<!--
		{{ formattedAmount }}
		<template v-if="interval"> {{ interval }}</template>
		<template v-if="paymentType"> {{ $t('donation_summary_via') }} {{ paymentType }}</template>-->
	</p>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { MembershipApplication } from '@src/Domain/Membership/MembershipApplication';
import { YearlyMembershipFee } from '@src/view_models/MembershipFee';

const props = defineProps<{
	payment: MembershipApplication;
}>();
const { t, n } = useI18n();
/*

const formattedAmount = computed( () => {
	const membershipFee = props.payment.membershipFee;

	const membershipFeeInNumber = typeof membershipFee === 'number' ? membershipFee : Number( membershipFee );

	if ( !Number.isFinite( membershipFeeInNumber ) ) {
		return '';
	}

	return n( membershipFeeInNumber, { key: 'currency', currencyDisplay: 'name' } );
} );

const interval = computed( () => props.payment.paymentIntervalInMonths ? t( 'donation_form_payment_interval_' + props.payment.paymentIntervalInMonths ) : '' );

const paymentType = computed( () => props.payment.paymentType ? t( props.payment.paymentType ) : '' );
*/
const renderAmount = ( amount: number, interval: number, intervalTranslation: String ): string => {
	if ( interval === 12 ) {
		return '';
	}
	const formattedAmount = n( amount, { key: 'currency', currencyDisplay: 'name' } );
	return `(${formattedAmount} ${intervalTranslation})`;
};

const summaryData = computed( () => {
	// const countryObject = props.countries.find( c => ( c.countryCode === props.address.countryCode ) );
	const yearlyFee = new YearlyMembershipFee( props.payment.paymentIntervalInMonths, props.payment.membershipFee );
	return {
		paymentInterval: t( 'donation_form_payment_interval_' + props.payment.paymentIntervalInMonths ),
		membershipType: t( props.payment.membershipType === 'active' ? 'membership_type_active' : 'membership_type_sustaining' ),
		membershipFeeFormatted: n( yearlyFee.membershipFeePerInterval, { key: 'currency', currencyDisplay: 'name' } ),
		membershipFeeYearlyFormatted: renderAmount(
			yearlyFee.yearlyFee,
			yearlyFee.paymentIntervalInMonths,
			t( 'donation_form_payment_interval_12' )
		),
		paymentType: t( props.payment.paymentType ),
		/* address: renderAddress(
			props.address,
			countryObject ? countryObject.countryFullName : '',
			renderSalutation()
		), */
	};
} );
</script>
